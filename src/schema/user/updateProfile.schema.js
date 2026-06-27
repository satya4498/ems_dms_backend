export const updateProfileSchema = {
  body: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        minLength: 1,
        maxLength: 50
      },
      lastName: {
        type: 'string',
        minLength: 1,
        maxLength: 50
      },
      email: {
        type: 'string',
        format: 'email'
      },
      phoneCode: {
        type: 'string',
        minLength: 1,
        maxLength: 10
      },
      dateOfBirth: {
        type: 'string',
        format: 'date'
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'unknown']
      },
      address: {
        type: 'string',
        maxLength: 255
      },
      city: {
        type: 'string',
        maxLength: 100
      },
      state: {
        type: 'string',
        maxLength: 100
      },
      country: {
        type: 'string',
        maxLength: 100
      },
      zipCode: {
        type: 'string',
        maxLength: 20
      },
      imageUrl: {
        type: 'string',
        format: 'uri'
      },
      description: {
        type: 'string',
        maxLength: 500
      },
      phone: {
        type: 'string',
        minLength: 10,
        maxLength: 15
      },
      userId: { type: 'string' }
    },
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
                phoneCode: { type: 'string' },
                phone: { type: 'string' },
                phoneVerified: { type: 'boolean' },
                dateOfBirth: { type: 'string' },
                gender: { type: 'string' },
                loggedIn: { type: 'boolean' },
                lastLoggedInIp: { type: 'string' },
                loggedInAt: { type: 'string' },
                imageUrl: { type: 'string' },
                address: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
                zipCode: { type: 'string' },
                role: { type: 'string' },
                description: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
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

export const updateProfileBodySchema = updateProfileSchema.body
export const updateProfileResponseSchema = updateProfileSchema.response
