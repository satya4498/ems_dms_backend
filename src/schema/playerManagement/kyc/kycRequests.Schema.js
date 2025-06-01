export const kycRequestsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            users: {
              type: 'array',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                emailVerified: { type: 'boolean' },
                kycStatus: { type: 'boolean' },
                kycRejectDescription: { type: 'string' },
                isActive: { type: 'boolean' },
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
