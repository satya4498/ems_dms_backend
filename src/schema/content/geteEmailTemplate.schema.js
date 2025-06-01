export const getEmailTemplateSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            emailTemplates: {
              type: 'array',
              items: {
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
                },
                required: ['id', 'label', 'eventType', 'isDefault', 'templateCode', 'dynamicData', 'updatedAt', 'createdAt']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
