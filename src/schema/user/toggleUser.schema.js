export const toggleUserSchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      isActive: { type: 'boolean' }
    },
    required: ['userId'],
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                phoneCode: { type: 'string' },
                isActive: { type: 'boolean' },
                role: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
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

export const toggleUserBodySchema = toggleUserSchema.body
export const toggleUserResponseSchema = toggleUserSchema.response
