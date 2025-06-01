import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    stateCodes: { type: 'array' }
  },
  required: ['gameId', 'stateCodes']
})

export class GameRemoveRestrictedStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, transaction })
      if (!game) return this.addError('ProviderNotFoundErrorType')

      const states = await this.context.sequelize.models.state.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'stateIds']],
        where: { code: { [Op.in]: this.args.stateCodes } },
        raw: true,
        transaction
      })

      game.restrictedStates = _.difference(game.restrictedStates, states.stateIds)

      await game.save({ transaction })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
