export const getNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            notification: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'object' },
                  description: { type: 'object' },
                  image: { type: 'string' },
                  url: { type: 'string' },
                  isActive: { type: 'boolean' },
                  userNotifications: { type: 'array' }
                }
              }
            },
            page: { type: 'string' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
