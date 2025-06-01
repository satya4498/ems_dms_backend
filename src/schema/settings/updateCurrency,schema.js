export const updateCurrencyResponseSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            currency: { $ref: '#/definitions/currency' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
