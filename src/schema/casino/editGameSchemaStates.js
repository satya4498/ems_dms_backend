export const editGameSchemaStates = {
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              game: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  uniqueId: { type: 'string' },
                  name: { type: 'object' },
                  casinoSubCategoryId: { type: 'string' },
                  casinoProviderId: { type: 'string' },
                  returnToPlayer: { type: 'number' },
                  wageringContribution: { type: 'number' },
                  iconUrl: { type: 'string' },
                  orderId: { type: 'string' },
                  volatilityRating: { type: 'string' },
                  hasFreespins: { type: 'string' },
                  devices: { type: ['string', 'array'] },
                  demoAvailable: { type: 'boolean' },
                  restrictedStates: { type: ['string', 'array'] },
                  isFeatured: { type: 'boolean' },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          },
          errors: { type: 'array' }
        }
      }
    }
  }
  