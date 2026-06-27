export const verifyEmailOtpBodySchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    otp: { type: 'string', minLength: 6, maxLength: 6 }
  },
  required: ['email', 'otp'],
  additionalProperties: false
}
