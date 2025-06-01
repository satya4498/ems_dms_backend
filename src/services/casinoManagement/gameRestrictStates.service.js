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

export class GameRestrictStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { gameId, stateCodes } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: gameId }, transaction })
      if (!game) return this.addError('GameNotFoundErrorType')

      const states = await this.context.sequelize.models.state.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'stateIds']],
        where: { code: { [Op.in]: stateCodes } },
        raw: true,
        transaction
      })

      const newRestrictedStates = _.difference(states.stateIds, game.restrictedStates)
      game.restrictedStates = game.restrictedStates.concat(newRestrictedStates)

      await game.save({ transaction })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
