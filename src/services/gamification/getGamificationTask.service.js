import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    gamificationId: { type: 'string' },
    page: { type: 'string', default: '1' },
    perPage: { type: 'string', default: '10' },
    isActive: { type: 'boolean' }
  },
  required: ['gamificationId']
})

export class GetGamificationTaskService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { search, gamificationId, isActive } = this.args
    const { gamification: gamificationModel, gamificationTaskGame: gamificationTaskGameModel, gamificationTask: gamificationTaskModel, gamificationTaskCurrency: gamificationTaskCurrencyModel, currency: currencyModel, casinoGame: casinoGameModel } = this.context.sequelize.models
    const page = parseInt(this.args.page, 10) || 1
    const perPage = parseInt(this.args.perPage, 10) || 10

    const where = { gamificationId }

    if (search) {
      where['name.EN'] = { [Op.iLike]: `%${search}%` }
    }
    if (_.isBoolean(isActive)) where.isActive = isActive

    try {
      const gamificationData = await gamificationTaskModel.findAndCountAll({
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['updatedAt', 'DESC']],
        attributes: { exclude: ['createdAt'] },
        include: [
          {
            model: gamificationTaskCurrencyModel,
            as: 'currencies',
            include: [{
              model: currencyModel,
              attributes: ['code', 'id'],
              as: 'currency'
            }]
          },
          {
            model: gamificationTaskGameModel,
            as: 'taskGames',
            attributes: ['id', 'gameId', 'minBetAmount'],
            include: [
              {
                model: casinoGameModel,
                as: 'casinoGame',
                attributes: ['id', 'name', 'mobileImageUrl', 'thumbnailUrl'] // customize as needed
              }
            ]
          }
        ]
      })

      return {
        gamification: gamificationData.rows,
        page: String(page),
        totalPages: Math.ceil(gamificationData.count / perPage)
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
