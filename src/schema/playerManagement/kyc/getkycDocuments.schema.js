export const getDocumentLabelsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            documentLabels: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  required: { type: 'boolean' },
                  id: { type: 'string' },
                  name: { type: 'string' },
                  documents: { type: 'array' }
                }
              }
            },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
