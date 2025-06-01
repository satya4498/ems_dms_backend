export const getBankingTransactionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            transactions: { type: 'array' },
            totalPurchaseAmount: { type: 'number' },
            totalRedeemAmount: { type: 'number' },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          },
          required: ['transactions', 'totalPurchaseAmount', 'totalRedeemAmount', 'page', 'totalPages']
        },
        errors: { type: 'array' }
      }
    }
  }
}
