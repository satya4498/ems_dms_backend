export const getPendingRedemptionsSchema = {
  query: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'all'] }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            redemptions: {
              type: 'array',
              items: {
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
                      phone: { type: 'string' },
                      email: { type: 'string' }
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
              }
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number' },
                totalPages: { type: 'number' },
                totalCount: { type: 'number' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
                limit: { type: 'number' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
