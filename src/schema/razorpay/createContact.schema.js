export const createContactSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      email: { type: 'string', format: 'email' },
      contact: { type: 'string', minLength: 10, maxLength: 15 },
      type: { type: 'string', enum: ['customer', 'employee'] },
      reference_id: { type: 'string', maxLength: 100 },
      notes: {
        type: 'object',
        properties: {
          notes_key_1: { type: 'string' },
          notes_key_2: { type: 'string' }
        }
      }
    },
    required: ['name', 'contact']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            contact: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                contact: { type: 'string' },
                type: { type: 'string' },
                reference_id: { type: 'string' },
                notes: { type: 'object' },
                created_at: { type: 'number' }
              }
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                contactId: { type: 'string' },
                name: { type: 'string' }
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
