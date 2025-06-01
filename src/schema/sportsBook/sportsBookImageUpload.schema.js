export const uploadSportsBookImageSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            fileLocation: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
