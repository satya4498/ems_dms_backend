import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameIds: { type: 'array' }
  },
  required: ['gameIds']
})

export class ReorderGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const gameIds = [...(new Set(this.args.gameIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      await Promise.all(gameIds.map(async (gameId, index) => {
        await this.context.sequelize.models.casinoGame.update({ orderId: index + 1 }, { where: { id: gameId }, transaction })
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
