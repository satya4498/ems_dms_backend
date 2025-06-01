export const getWageringTemplateDetailsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            template: { type: 'array' },
            page: { type: 'string' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
