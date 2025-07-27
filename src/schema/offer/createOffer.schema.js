export const createOfferSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', maxLength: 1000 },
      userId: { type: 'string' },
      price: { type: 'number', minimum: 0 },
      productName: { type: 'string', maxLength: 255 },
      productCategory: { type: 'string', enum: ['Royal', 'Ultima', 'Regular'] },
      createdBy: { type: 'string' },
      validFrom: { type: 'string', format: 'date-time' },
      validTo: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean', default: true }
    },
    required: ['title']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            offer: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                userId: { type: 'string' },
                createdBy: { type: 'string' },
                validFrom: { type: 'string' },
                validTo: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    phone: { type: 'string' }
                  }
                },
                creator: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
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
