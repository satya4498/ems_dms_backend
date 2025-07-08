export const addBankAccountSchema = {
  body: {
    type: 'object',
    properties: {
      contactId: { type: 'string' },
      name: { type: 'string', minLength: 1, maxLength: 100 },
      ifsc: { type: 'string', minLength: 11, maxLength: 11 },
      account_number: { type: 'string', minLength: 9, maxLength: 18 }
    },
    required: ['contactId', 'name', 'ifsc', 'account_number']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            fundAccount: {
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
            },
            message: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
