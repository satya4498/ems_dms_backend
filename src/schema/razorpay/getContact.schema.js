export const getContactSchema = {
  query: {
    type: 'object',
    properties: {
      contactId: { type: 'string' }
    },
    required: ['contactId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            contact: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                contact: { type: 'string' },
                type: { type: 'string' },
                reference_id: { type: 'string' },
                notes: { type: 'object' },
                created_at: { type: 'number' }
              }
            },
            fundAccounts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  contact_id: { type: 'string' },
                  account_type: { type: 'string' },
                  bank_account: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      ifsc: { type: 'string' },
                      account_number: { type: 'string' }
                    }
                  },
                  active: { type: 'boolean' },
                  created_at: { type: 'number' }
                }
              }
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                contactId: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
