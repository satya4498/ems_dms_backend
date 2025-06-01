export const editAggregatorSchema = {
  response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              aggregator: {
                type: 'object',
                properties: {
                  isDefault: { type: 'boolean' },
                  id: { type: 'number' },
                  name: { type: 'object' },
                  uniqueId: { type: 'string' },
                  isActive: { type: 'boolean' },
                  desktopThumbnailUrl: { type: 'string' },
                  mobileThumbnailUrl: {type: 'string'},
                  updatedAt: { type: 'string' },
                  createdAt: { type: 'string' },
                  orderId: { type: 'string' }
                }
              }
            }
          },
          errors: { type: 'array' }
        }
      }
    }
  }