import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BET_SLIP_SETTLEMENT_STATUS, BET_SLIP_TYPES } from '@src/utils/constants/sportbookManagement.constants.js'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' }, // eventname
    userId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    type: { enum: Object.values(BET_SLIP_TYPES) },
    settlementStatus: { enum: Object.values(BET_SLIP_SETTLEMENT_STATUS) },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'providerId', 'name'], default: 'id' }
  }
})

export class GetSportsbookBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const page = this.args.page
    const perPage = this.args.perPage
    const type = this.args.type
    const settlementStatus = this.args.settlementStatus
    const toDate = this.args.toDate
    const fromDate = this.args.fromDate
    const searchString = this.args.searchString

    try {
      const where = {}
      if (toDate || fromDate) where.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      if (type) where.type = type
      if (userId) where.userId = userId
      if (settlementStatus) where.settlementStatus = settlementStatus

      const sportsbookBets = await this.context.sequelize.models.betslip.findAndCountAll({
        where,
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.bet,
          include: {
            attributes: ['fixtureId'],
            model: this.context.sequelize.models.event,
            includes: {
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              model: this.context.sequelize.models.eventPatrticipant,
              include: {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                model: this.context.sequelize.models.participant,
                ...(searchString ? { where: { name: { [Op.iLike]: `%${searchString}%` } } } : {})
              }
            }
          }
        },
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { sportsbookBets: sportsbookBets.rows, page, totalPages: Math.ceil(sportsbookBets.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
