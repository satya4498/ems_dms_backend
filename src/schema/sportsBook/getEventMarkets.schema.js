export const getEventsMarketsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            eventMarkets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  eventId: { type: 'string' },
                  status: { type: 'string' },
                  marketId: { type: 'string' },
                  market: { type: 'object' },
                  outcomes: { type: 'array' }
                },
                required: ['id', 'eventId', 'status', 'marketId', 'market', 'outcomes']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
