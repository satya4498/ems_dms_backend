export const signUpBodySchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1, maxLength: 100 },
    lastName: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8, maxLength: 128 },
    phone: { type: 'string', minLength: 10, maxLength: 15 },
    phoneCode: { type: 'string', minLength: 1, maxLength: 10 },
    businessType: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
}
