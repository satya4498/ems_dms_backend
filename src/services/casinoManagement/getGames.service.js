import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    isActive: { type: 'boolean' },
    isFeatured: { type: 'boolean' },
    casinoProviderId: { type: 'string' },
    casinoCategoryId: { type: 'string' },
    searchString: { type: 'string' },
    notIncluded: { type: 'boolean', default: false },
    gameIds: { type: 'array', default: [] },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'uniqueId', 'name', 'returnToPlayer', 'status', 'orderId'], default: 'orderId' }
  }
})

export class GetGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const locale = this.context.locale
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString
    const isFeatured = this.args.isFeatured
    const casinoProviderId = this.args.casinoProviderId
    const notIncluded = this.args.notIncluded
    const casinoCategoryId = this.args.casinoCategoryId

    try {
      const where = {}
      const casinoGameCategoryWhere = {}
      if (_.isBoolean(isFeatured)) where.isFeatured = isFeatured
      if (this.args.gameIds.length) where.id = { [Op.in]: this.args.gameIds }
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (casinoProviderId) where.casinoProviderId = casinoProviderId
      if (casinoCategoryId) casinoGameCategoryWhere.casinoCategoryId = notIncluded ? { [Op.ne]: casinoCategoryId } : casinoCategoryId
      if (searchString) where[`name.${locale}`] = { [Op.iLike]: `%${searchString}%` }

      const games = await this.context.sequelize.models.casinoGame.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        include: [{
          attributes: ['id', 'name'],
          model: this.context.sequelize.models.casinoProvider,
          include: {
            model: this.context.sequelize.models.casinoAggregator,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        },
        {
          attributes: ['id', 'casinoCategoryId', 'casinoGameId'],
          model: this.context.sequelize.models.casinoGameCategory,
          where: casinoGameCategoryWhere,
          required: true,
          include: [{
            model: this.context.sequelize.models.casinoCategory
          }]
        }
        ],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]],
        distinct: true
      })
      return { games: games.rows, page, totalPages: Math.ceil(games.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
