import { esClient } from './client';

export const searchProperties = async (params: {
  query: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: any[];
  total: number;
  page: number;
  limit: number;
}> => {
  const {
    query,
    city,
    minPrice,
    maxPrice,
    propertyType,
    status,
    page = 1,
    limit = 15,
  } = params;

  const must: any[] = [];

  if (query) {
    must.push({
      multi_match: {
        query,
        type: 'cross_fields',
        fields: ['title^3', 'city.autocomplete^2', 'locality.autocomplete'],
        operator: 'and',
        fuzziness: 'AUTO',
      },
    });
  }

  if (city) must.push({ term: { city: city.toLowerCase() } });
  if (propertyType) must.push({ term: { type: propertyType } });
  if (status) must.push({ term: { status } });
  if (minPrice || maxPrice) {
    must.push({
      range: {
        price: {
          gte: minPrice ?? 0,
          lte: maxPrice ?? Number.MAX_SAFE_INTEGER,
        },
      },
    });
  }

  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: 'properties',
    from,
    size: limit,
    body: {
      query: {
        bool: {
          must,
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
          terms: { field: 'type' },
        },
      },
    } as any,
  });

  const total =
    typeof result.hits.total === 'number'
      ? result.hits.total
      : result.hits.total?.value ?? 0;

  return {
    data: result.hits.hits.map((hit: any) => hit._source),
    total,
    page,
    limit,
  };
};
