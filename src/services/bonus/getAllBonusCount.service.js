import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusType: { enum: Object.values(BONUS_TYPES) },
    isActive: { type: 'boolean' }
  }
})

export class GetAllBonusCountService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { bonusType, isActive } = this.args
    const where = {}
    const { bonus: bonusModel } = this.context.sequelize.models
    const { fn, col } = this.context.sequelize

    try {

      if (bonusType) where.bonusType = bonusType
      if (_.isBoolean(isActive)) where.isActive = isActive

      const bonusCounts = await bonusModel.findAll({
        attributes: [
          'bonusType',
          [fn('COUNT', col('id')), 'count']
        ],
        where,
        group: ['bonusType'],
        order: [['bonusType', 'ASC']],
      })

      return bonusCounts;
    } catch (error) {
      throw new APIError(error)
    }
  }
}