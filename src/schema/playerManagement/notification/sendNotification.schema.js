export const sendNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            result: { type: 'array' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
