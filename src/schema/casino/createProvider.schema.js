export const createProviderSchema = {
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              provider: {
                type: 'object',
                properties: {
                  isDefault: { type: 'boolean' },
                  id: { type: 'number' },
                  name: { type: 'object' },
                  uniqueId: { type: 'string' },
                  isActive: { type: 'boolean' },
                  updatedAt: { type: 'string' },
                  createdAt: { type: 'string' },
                  iconUrl: { type: 'string' },
                  orderId: { type: 'string' },
                  mobileThumbnailUrl: {type: 'string'}
                }
              }
            }
          },
          errors: { type: 'array' }
        }
      }
    }
  }
  