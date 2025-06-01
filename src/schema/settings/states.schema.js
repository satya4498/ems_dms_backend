export const getStatesSchema = {
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              states: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },            // State ID
                    code: { type: 'string' },          // State code (e.g., 'AL', 'CA', etc.)
                    name: { type: 'string' },          // State name (e.g., 'Alabama', 'California', etc.)
                    languageId: { type: 'string' },    // Language ID, if used in association
                    isActive: { type: 'boolean' },     // State active status
                    language: { type: 'string' }       // Language name or code associated with the state
                  },
                  required: ['id', 'code', 'name', 'languageId', 'isActive', 'language']
                }
              },
              page: { type: 'string' },            // Current page number
              totalPages: { type: 'number' }      // Total number of pages available
            }
          },
          errors: { type: 'array' }              // Error array if any
        }
      }
    }
  }
  