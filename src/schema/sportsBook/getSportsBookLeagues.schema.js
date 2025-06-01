export const getSportsBookLeaguesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            leagues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  providerId: { type: 'string' },
                  name: { type: 'string' },
                  isActive: { type: 'boolean' },
                  sportId: { type: 'string' },
                  locationId: { type: 'string' }
                },
                required: ['id', 'providerId', 'name', 'isActive', 'sportId', 'locationId']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
