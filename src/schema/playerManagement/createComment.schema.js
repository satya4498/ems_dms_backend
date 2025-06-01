export const createCommentSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            userComment: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                title: { type: 'string' },
                comment: { type: 'string' },
                commenterId: { type: 'string' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                status: { type: 'boolean' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
