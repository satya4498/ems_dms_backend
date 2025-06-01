
export const createChatRainSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      prizeMoney: { type: 'number' },
      currency: { type: 'string' },
      chatGroupId: { type: 'number' }
    },
    required: ['name', 'prizeMoney', 'currency','chatGroupId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            newChatRain: { $ref: '#/definitions/chatRain' },
            message: { type: 'string' },
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
