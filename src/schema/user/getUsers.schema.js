import { BUSINESS_TYPES } from '@src/utils/constants/public.constants.utils'

export const getUsersSchema = {
  body: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 1000 },
      search: { type: 'string', maxLength: 255 },
      businessType: { type: 'string', enum: Object.values(BUSINESS_TYPES) }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  phoneCode: { type: 'string' },
                  isActive: { type: 'boolean' },
                  role: { type: 'string' },
                  businessType: { type: 'string', enum: Object.values(BUSINESS_TYPES) },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
