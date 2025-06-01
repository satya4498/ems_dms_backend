export const getLocationsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            locations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  providerId: { type: 'string' },
                  name: { type: 'string' },
                  isActive: { type: 'boolean' }
                },
                required: ['id', 'providerId', 'name', 'isActive']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
