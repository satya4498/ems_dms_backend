export const getOffersSchema = {
  query: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
      userId: { type: 'string' },
      isActive: { type: 'boolean' },
      search: { type: 'string', maxLength: 255 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            offers: {
              type: 'array',
              items: {
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
              }
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number' },
                totalPages: { type: 'number' },
                totalCount: { type: 'number' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
                limit: { type: 'number' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
