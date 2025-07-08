export const approveRedemptionSchema = {
  body: {
    type: 'object',
    properties: {
      redemptionId: { type: 'string' },
      action: { type: 'string', enum: ['approve', 'reject'] },
      remarks: { type: 'string', maxLength: 500 }
    },
    required: ['redemptionId', 'action']
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
                adminId: { type: 'string' },
                approvedAt: { type: 'string' },
                remarks: { type: 'string' },
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
                },
                admin: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                }
              }
            },
            payoutDetails: {
              type: 'object',
              properties: {
                walletDebit: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    amount: { type: 'number' },
                    oldBalance: { type: 'number' },
                    newBalance: { type: 'number' }
                  }
                },
                razorpayPayout: {
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
                }
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
