import { property } from "../../models/property-model";
import {esClient} from "../../services/elastic-search/client";
import { searchQueryParams, updatePropertyParams } from "./types";

const PROPERTY_INDEX = 'properties';

// Index a property document in Elasticsearch
export const indexProperty = async (propertyData: property) => {
  await esClient.index({
    index: PROPERTY_INDEX,
    id: propertyData._id as string, // assuming MongoDB ObjectId
    body: {
      title: propertyData.title,
      city: propertyData.location.city,
      locality: propertyData.location.locality,
      sector: propertyData.location.sector || '',
      type: propertyData.type,
      price: propertyData.price,
      area: propertyData.area,
      status: propertyData.status,
      amenities: propertyData.amenities || [],
      suggest: {
        input: [
          propertyData.title,
          propertyData.location.city,
          propertyData.location.locality,
          ...(propertyData.amenities || []),
        ],
      },
    },
  });
};

// Update a property document in Elasticsearch
export const updatePropertyInElasticServer = async (propertyData: property) => {
  await esClient.update({
    index: PROPERTY_INDEX,
    id: propertyData._id as string,
    doc: {
      title: propertyData.title,
      city: propertyData.location.city,
      locality: propertyData.location.locality,
      sector: propertyData.location.sector || '',
      type: propertyData.type,
      price: propertyData.price,
      area: propertyData.area,
      status: propertyData.status,
      amenities: propertyData.amenities || [],
      suggest: {
        input: [
          propertyData.title,
          propertyData.location.city,
          propertyData.location.locality,
          ...(propertyData.amenities || []),
        ],
      },
    },
  });
};

// Delete a property document from Elasticsearch
export const deletePropertyFromElasticServer = async (propertyId: string) => {
  await esClient.delete({
    index: PROPERTY_INDEX,
    id: propertyId.toString(),
  });
};

// indexer.ts - searchProperties function
export const searchProperties = async (params: searchQueryParams): Promise<{
  data: any[];
  total: number;
  page: number;
  limit: number;
}> => {
  const {
    keyword: query,
    city,
    priceMin: minPrice,
    priceMax: maxPrice,
    type: propertyType,
    status,
    page = 1,
  } = params;
  
  const DEFAULT_LIMIT = 15;
  const must: any[] = [];
  const should: any[] = [];
  const filter: any[] = [];

  // Handle search query
  if (query) {
    should.push(
      {
        match: {
          title: {
            query,
            boost: 3,
            fuzziness: 'AUTO'
          }
        }
      },
      {
        match: {
          'city.autocomplete': {
            query,
            boost: 2,
            fuzziness: 'AUTO'
          }
        }
      },
      {
        match: {
          'locality.autocomplete': {
            query,
            fuzziness: 'AUTO'
          }
        }
      }
    );
    must.push({ bool: { should } });
  }

  // Handle filters - using keyword fields for exact matching
  if (city) filter.push({ term: { 'city.keyword': city.toLowerCase() } });
  if (propertyType) filter.push({ term: { 'type.keyword': propertyType } });
  if (status) filter.push({ term: { 'status.keyword': status } });
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.push({
      range: {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    });
  }

  const from = (page - 1) * DEFAULT_LIMIT;

  const result = await esClient.search({
    index: PROPERTY_INDEX,
    from,
    size: DEFAULT_LIMIT,
    body: {
      query: {
        bool: {
          must: must.length ? must : undefined,
          filter: filter.length ? filter : undefined,
        },
      },
      aggs: {
        price_ranges: {
          range: {
            field: 'price',
            ranges: [
              { to: 500000 },
              { from: 500000, to: 1000000 },
              { from: 1000000 },
            ],
          },
        },
        property_types: {
          terms: { 
            field: 'type.keyword',  // Use keyword field for aggregation
            size: 10  // Limit number of buckets returned
          },
        },
        cities: {
          terms: { 
            field: 'city.keyword',
            size: 10
          },
        },
        statuses: {
          terms: { 
            field: 'status.keyword',  // Use keyword field for aggregation
            size: 10
          },
        },
      },
    } as any,
  });

  // Handle different Elasticsearch response formats for total hits
  const total = typeof result.hits.total === 'number' 
    ? result.hits.total 
    : result.hits.total?.value ?? 0;

  return {
    data: result.hits.hits.map((hit: any) => ({
      ...hit._source,
      id: hit._id
    })),
    total,
    page,
    limit: DEFAULT_LIMIT,
  };
};

