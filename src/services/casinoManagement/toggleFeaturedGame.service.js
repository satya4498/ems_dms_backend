import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' }
  },
  required: ['gameId']
})

export class ToggleFeaturedGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId } })
      if (!game) return this.addError('GameNotFoundErrorType')

      game.isFeatured = !game.isFeatured
      await game.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
