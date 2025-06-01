import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    categoryIds: { type: 'array' }
  },
  required: ['categoryIds']
})

export class ReorderCategoriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const categoryIds = [...(new Set(this.args.categoryIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      await Promise.all(categoryIds.map(async (categoryId, index) => {
        await this.context.sequelize.models.casinoCategory.update({ orderId: index + 1 }, { where: { id: categoryId }, transaction })
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
