export const createEmailTemplateSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            emailTemaplate: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                label: { type: 'string' },
                eventType: { type: 'string' },
                isDefault: { type: 'boolean' },
                templateCode: { type: 'object' },
                dynamicData: { type: 'array' },
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
