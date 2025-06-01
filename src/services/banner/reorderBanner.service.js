import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bannerIds: { type: 'array' },
    bannerTypeId: { type: 'string' }
  },
  required: ['bannerIds']
})

export class ReorderGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let {
      args: { bannerIds, bannerTypeId },
      context: { models: { banner: bannerModel }, sequelizeTransaction: transaction }
    } = this

    bannerIds = [...(new Set(bannerIds))]

    try {
      await Promise.all(bannerIds.map(async (bannerId, index) => {
        await bannerModel.update({ orderId: index + 1 }, { where: { id: bannerId, bannerTypeId }, transaction })
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
