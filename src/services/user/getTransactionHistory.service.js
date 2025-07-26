import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const getTransactionHistoryConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 1000, default: 10 },
    type: { type: 'string', enum: ['credit', 'debit', 'all'] }
  },
  required: ['userId']
})

export class GetTransactionHistoryService extends ServiceBase {
  get constraints () {
    return getTransactionHistoryConstraints
  }

  async run () {
    try {
      const { userId, page = 1, limit = 10, type = 'all' } = this.args

      // Check if user exists
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId }
      })
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found')
      }

      // Get user's wallet
      const wallet = await this.context.sequelize.models.wallet.findOne({
        where: { userId },
        include: {
          model: this.context.sequelize.models.currency
        }
      })

      if (!wallet) {
        return this.addError('WalletNotFoundErrorType', 'User wallet not found')
      }

      // Build where clause for transactions
      const whereClause = { walletId: wallet.id }
      if (type !== 'all') {
        whereClause.type = type
      }
      // Calculate offset
      const offset = (page - 1) * limit

      // Get transactions with pagination
      const { count, rows: transactions } = await this.context.sequelize.models.transaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: this.context.sequelize.models.ledger,
            as: 'ledger',
            required: false // Make it a LEFT JOIN so transactions without ledgers are still returned
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })

      // Calculate pagination info
      const totalPages = Math.ceil(count / limit)
      const hasNextPage = page < totalPages
      const hasPrevPage = page > 1

      this.log.info('Transaction History Retrieved', {
        message: 'User transaction history retrieved successfully',
        context: { userId, page, limit, totalCount: count }
      })

      return {
        transactions,
        wallet: {
          id: wallet.id,
          balance: wallet.balance,
          currency: wallet.currency
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    } catch (err) {
      this.log.error('Get Transaction History Failed', {
        message: err.message,
        context: { userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
