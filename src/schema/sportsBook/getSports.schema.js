export const getSportsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            sports: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  providerId: { type: 'string' },
                  name: { type: 'string' },
                  isActive: { type: 'boolean' },
                  orderId: { type: 'number' }
                },
                required: ['id', 'providerId', 'name', 'isActive', 'orderId']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
