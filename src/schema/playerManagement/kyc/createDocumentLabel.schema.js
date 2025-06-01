export const createDocumentLabelSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            documentLabel: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                required: { type: 'boolean' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
