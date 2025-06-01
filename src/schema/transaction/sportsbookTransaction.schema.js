export const getSportsBookTransactionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            sportsbookTransactions: { type: 'array' },
            totalBetAmount: { type: 'number' },
            totalWinAmount: { type: 'number' },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          },
          required: ['sportsbookTransactions', 'totalBetAmount', 'totalWinAmount', 'page', 'totalPages']
        },
        errors: { type: 'array' }
      }
    }
  }
}
