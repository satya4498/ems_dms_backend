import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betSlipId: { type: 'string' }
  },
  required: ['betSlipId']
})

export class GetSportsbookBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const sportsbookBet = await this.context.sequelize.models.betslip.findOne({
        where: { betSlipId: this.args.betSlipId },
        include: [{
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
                model: this.context.sequelize.models.participant
              }
            }
          }
        }, {
          attributes: { exclude: ['username', 'email'] },
          model: this.context.sequelize.models.user
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.sportsbookTransaction,
          include: {
            model: this.context.sequelize.models.ledger
          }
        }]
      })

      return { sportsbookBet }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
