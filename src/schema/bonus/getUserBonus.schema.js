export const getUserBonusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            userBonus: {
              type: 'array',
              items: { $ref: '#/definitions/userBonus' }
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
