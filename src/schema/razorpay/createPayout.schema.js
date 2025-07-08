export const createPayoutSchema = {
  body: {
    type: 'object',
    properties: {
      contactId: { type: 'string' },
      fundAccountId: { type: 'string' },
      amount: { type: 'number', minimum: 1 },
      mode: { type: 'string', enum: ['IMPS', 'NEFT', 'RTGS'] },
      purpose: { type: 'string', maxLength: 100 },
      reference_id: { type: 'string', maxLength: 100 },
      narration: { type: 'string', maxLength: 100 }
    },
    required: ['contactId', 'fundAccountId', 'amount']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            payout: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                account_number: { type: 'string' },
                fund_account_id: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string' },
                mode: { type: 'string' },
                purpose: { type: 'string' },
                reference_id: { type: 'string' },
                narration: { type: 'string' },
                status: { type: 'string' },
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
