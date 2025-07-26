export const redeemQrCodeSchema = {
  body: {
    type: 'object',
    properties: {
      qrCodeId: { type: 'string' },
      userId: { type: 'string' },
      name: { type: 'string', minLength: 1, maxLength: 100 },
      ifsc: { type: 'string', minLength: 11, maxLength: 11 },
      accountNumber: { type: 'string', minLength: 9, maxLength: 18 }
    },
    required: ['qrCodeId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            redemption: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                qrCodeId: { type: 'string' },
                userId: { type: 'string' },
                status: { type: 'string' },
                redeemedAt: { type: 'string' },
                createdAt: { type: 'string' },
                payoutQrCode: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    code: { type: 'string' },
                    amount: { type: 'number' }
                  }
                },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    phone: { type: 'string' }
                  }
                }
              }
            },
            wallet: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                balance: { type: 'number' },
                currency: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    code: { type: 'string' },
                    symbol: { type: 'string' }
                  }
                }
              }
            },
            transaction: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                amount: { type: 'number' },
                type: { type: 'string' },
                reference: { type: 'string' }
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
