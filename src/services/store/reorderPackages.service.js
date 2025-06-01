import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    packageIds: { type: 'array' }
  },
  required: ['packageIds']
})

export class ReorderPackagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const packageIds = [...(new Set(this.args.packageIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      await Promise.all(packageIds.map(async (packageId, index) => {
        await this.context.sequelize.models.package.update({ orderId: index + 1 }, { where: { id: packageId }, transaction })
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
