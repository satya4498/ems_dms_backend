export const resetPasswordBodySchema = {
  type: 'object',
  properties: {
    token: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 8, maxLength: 128 }
  },
  required: ['token', 'password'],
  additionalProperties: false
}
