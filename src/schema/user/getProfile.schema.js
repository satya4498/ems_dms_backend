export const getProfileSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId'],
  additionalProperties: false,
  response: {
    200: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phoneCode: { type: 'string' },
        phone: { type: 'string' },
        dateOfBirth: { type: 'string', format: 'date' },
        gender: { type: 'string', enum: ['male', 'female', 'unknown'] },
        address: { type: 'string', maxLength: 255 },
        city: { type: 'string', maxLength: 100 },
        state: { type: 'string', maxLength: 100 },
        country: { type: 'string', maxLength: 100 },
        zipCode: { type: 'string', maxLength: 20 },
        imageUrl: { type: 'string', format: 'uri' },
        description: { type: 'string', maxLength: 500 },
        role: { type: 'string' },
        isActive: { type: 'boolean' },
        businessType: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }
}
