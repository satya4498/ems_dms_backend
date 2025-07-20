import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const getPendingRedemptionsConstraints = ajv.compile({
  type: 'object',
  properties: {
    adminId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
    status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'all'] }
  },
  required: ['adminId']
})

export class GetPendingRedemptionsService extends ServiceBase {
  get constraints () {
    return getPendingRedemptionsConstraints
  }

  async run () {
    try {
      const { adminId, page = 1, limit = 10, status = 'all' } = this.args

      // Check if admin exists and has admin role
      const admin = await this.context.sequelize.models.user.findOne({
        where: { id: adminId, role: 'admin' }
      })
      if (!admin) {
        return this.addError('AdminUserNotFoundErrorType', 'Admin not found or insufficient permissions')
      }

      // Build where clause
      const whereClause = {}
      if (status !== 'all') {
        whereClause.status = status
      }

      // Calculate offset
      const offset = (page - 1) * limit

      // Get redemptions with pagination
      const { count, rows: redemptions } = await this.context.sequelize.models.payoutQrCodeRedemption.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: this.context.sequelize.models.payoutQrCode,
            as: 'payoutQrCode'
          },
          {
            model: this.context.sequelize.models.user,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
          },
          {
            model: this.context.sequelize.models.user,
            as: 'admin',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
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

      this.log.info('Pending Redemptions Retrieved', {
        message: 'Pending redemption requests retrieved successfully',
        context: { adminId, page, limit, totalCount: count }
      })

      return {
        redemptions,
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
      this.log.error('Get Pending Redemptions Failed', {
        message: err.message,
        context: { adminId: this.args.adminId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
