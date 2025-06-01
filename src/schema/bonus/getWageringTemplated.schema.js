export const getWageringTemplateSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            wageringTemplates: {
              type: 'array',
              items: { $ref: '#/definitions/wageringTemplate' }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
