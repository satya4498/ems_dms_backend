import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    categoryId: { type: 'string' },
    gameIds: { type: 'array' }
  },
  required: ['categoryId', 'gameIds']
})

export class AddGamesCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { categoryId, gameIds } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('CategoryNotFoundErrorType')

      this.context.sequelize.models.casinoGame.update({
        casinoCategoryId: category.id
      }, {
        where: { id: { [Op.in]: gameIds } },
        transaction
      })
      const games = await this.context.sequelize.models.casinoGame.findAll({
        where: { id: { [Op.in]: gameIds } },
        transaction,
      });

      if (games.length !== gameIds.length) {
        return this.addError('SomeGameNotFoundErrorType');
      }
      const existingAssociations = await this.context.sequelize.models.casinoGameCategory.findAll({
        where: {
          casinoGameId: { [Op.in]: gameIds },
          casinoCategoryId: categoryId,
        },
        attributes: ['casinoGameId'],
        transaction,
      })

      const existingGameIds = existingAssociations.map((assoc) => assoc.casinoGameId)
      const newGameIds = gameIds.filter((gameId) => !existingGameIds.includes(gameId))

      if (newGameIds.length === 0) {
        return this.addError('GamesAlreadyExistsErrorType');
      }

      const gameCategoryEntries = newGameIds.map((gameId) => ({
        casinoGameId: gameId,
        casinoCategoryId: categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await this.context.sequelize.models.casinoGameCategory.bulkCreate(gameCategoryEntries, {
        transaction,
        ignoreDuplicates: true,
      })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
