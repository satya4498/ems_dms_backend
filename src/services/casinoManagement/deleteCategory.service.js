import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    categoryId: { type: 'string' }
  },
  required: ['categoryId']
})

export class DeleteCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('CategoryNotFoundErrorType')

      const gameCount = await this.context.sequelize.models.casinoGame.count({ where: { casinoCategoryId: category.id }, transaction })
      if (gameCount) return this.addError('MoveAllTheGamesToAnotherCategoryErrorType')

      await category.destroy({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
