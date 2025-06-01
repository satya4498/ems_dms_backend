export const getLivePlayerDetailsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            purchaseConvRate: { type: 'number' },
            totalRegistrationToday: { type: 'number' },
            sportsbookBetData: { type: 'array' },
            casinoBetData: { type: 'array' },
            totalLoggedInPlayers: { type: 'number' },
            totalPlayers: { type: 'number' }
          },
          required: ['purchaseConvRate', 'totalRegistrationToday', 'sportsbookBetData', 'casinoBetData', 'totalLoggedInPlayers', 'totalPlayers']
        },
        errors: { type: 'array' }
      }
    }
  }
}
