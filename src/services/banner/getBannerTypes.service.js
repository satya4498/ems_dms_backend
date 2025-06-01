import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'

/**
 * get all banner types
 */
export class getBannerTypesService extends ServiceBase {
  async run () {
    const {
      context: { models: { bannerTypes: bannerTypeModel } }
    } = this

    try {
      const bannerTypes = await bannerTypeModel.findAll()

      return { bannerTypes }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
