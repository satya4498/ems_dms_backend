export const getEventsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  fixtureId: { type: 'string' },
                  status: { type: 'string' },
                  bettingEnabled: { type: 'boolean' },
                  score: { type: 'string' },
                  startDate: { type: 'string' },
                  leagueId: { type: 'string' },
                  league: { type: 'object' },
                  eventParticipants: { type: 'array' }
                },
                required: ['id', 'fixtureId', 'status', 'bettingEnabled', 'score', 'startDate', 'leagueId', 'league', 'eventParticipants']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
