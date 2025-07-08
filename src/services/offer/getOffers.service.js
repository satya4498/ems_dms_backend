import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const getOffersConstraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
    userId: { type: 'string' },
    isActive: { type: 'boolean' },
    search: { type: 'string', maxLength: 255 }
  }
})

export class GetOffersService extends ServiceBase {
  get constraints () {
    return getOffersConstraints
  }

  async run () {
    try {
      const { page = 1, limit = 10, userId, isActive, search } = this.args

      // Build where clause
      const whereClause = {}

      if (userId) {
        whereClause.userId = userId
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive
      }

      if (search) {
        whereClause.title = {
          [this.context.sequelize.Sequelize.Op.iLike]: `%${search}%`
        }
      }

      // Calculate offset
      const offset = (page - 1) * limit

      // Get offers with pagination
      const { count, rows: offers } = await this.context.sequelize.models.offer.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: this.context.sequelize.models.user,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: this.context.sequelize.models.user,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName']
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

      this.log.info('Offers Retrieved', {
        message: 'Offers retrieved successfully',
        context: { page, limit, totalCount: count }
      })

      return {
        offers,
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
      this.log.error('Get Offers Failed', {
        message: err.message,
        context: { page: this.args.page },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
