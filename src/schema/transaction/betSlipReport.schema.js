export const getBetSlipReportSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            betslips: { type: 'array' },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          },
          required: ['betslips', 'page', 'totalPages']
        },
        errors: { type: 'array' }
      }
    }
  }
}
