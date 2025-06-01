export const createNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            result: {
              type: 'object',
              properties: {
                isActive: { type: 'boolean' },
                id: { type: 'string' },
                title: { type: 'object' },
                description: { type: 'object' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                image: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
