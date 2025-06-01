export const getGamesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            games: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  uniqueId: { type: 'string' },
                  name: { type: 'object' },
                  casinoCategoryId: { type: 'string' },
                  casinoProviderId: { type: 'string' },
                  returnToPlayer: { type: 'number' },
                  wageringContribution: { type: 'number' },
                  mobileImageUrl: { type: 'string' },
                  desktopImageUrl: {type: 'string'},
                  orderId: { type: 'string' },
                  volatilityRating: { type: 'string' },
                  hasFreespins: { type: 'string' },
                  devices: { type: ['array', 'string'] },
                  demoAvailable: { type: 'boolean' },
                  restrictedCountries: { type: ['string', 'array'] },
                  restrictedStates: { type: ['string', 'array'] },
                  isFeatured: { type: 'boolean' },
                  isActive: { type: 'boolean' },
                  casinoProvider: { type: 'object' },
                  // casinoCategory: { type: 'object' },
                  casinoGameCategories: { type: 'array' },
                }
              }
            },
            totalPages: { type: 'number' },
            page: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
