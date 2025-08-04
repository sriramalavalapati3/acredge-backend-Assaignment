import { esClient } from './client';
const PROPERTY_INDEX = 'properties';

export const createPropertyIndex = async () => {
  try {
    const exists = await esClient.indices.exists({ index: PROPERTY_INDEX });
    if (exists) {
      console.log(`Index "${PROPERTY_INDEX}" already exists`);
      return;
    }

    
await esClient.indices.create({
  index: PROPERTY_INDEX,
  settings: {
    analysis: {
      analyzer: {
        edge_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'edge_ngram_tokenizer',
          filter: ['lowercase'],
        },
      },
      tokenizer: {
        edge_ngram_tokenizer: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
          token_chars: ['letter', 'digit'],
        },
      },
    },
  },
  mappings: {
    properties: {
      title: {
        type: 'text',
        analyzer: 'edge_ngram_analyzer',
        search_analyzer: 'standard',
      },
      city: {
        type: 'text',
        fields: {
          autocomplete: {
            type: 'text',
            analyzer: 'edge_ngram_analyzer',
            search_analyzer: 'standard',
          },
          keyword: { // Add keyword for exact match
            type: 'keyword',
            ignore_above: 256,
          },
        },
      },
      locality: {
        type: 'text',
        fields: { // Add autocomplete for locality
          autocomplete: {
            type: 'text',
            analyzer: 'edge_ngram_analyzer',
            search_analyzer: 'standard',
          },
        },
      },
      type: {
        type: 'text',
        fields: {
          keyword: {  // Add keyword sub-field
            type: 'keyword',
            ignore_above: 256
          }
        }
      },
      status: {
        type: 'text',
        fields: {
          keyword: {  // Add keyword sub-field
            type: 'keyword',
            ignore_above: 256
          }
        }
      },
      sector: { type: 'text' },
      area: { type: 'float' },
      price: { type: 'double' },
      amenities: { type: 'keyword' },
      suggest: { type: 'completion' }
    }
  }
});
    console.log(`Index "${PROPERTY_INDEX}" created successfully`);
  } catch (error) {
    console.error('Failed to create index:', error);
  }
};