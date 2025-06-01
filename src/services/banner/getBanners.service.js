import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
/**
 * get all banner types
 */

export class getBannerService extends ServiceBase {
  async run () {
    const {
      args: { page, perPage, bannerTypeId, isActive, order, orderBy, bannerId },
      context: { models: { banner: bannerModel, bannerTypes: bannerTypeModel } }
    } = this
    let filters = {}

    try {
      filters = {
        ...(bannerTypeId ? { bannerTypeId } : {}),
        ...(isActive ? { isActive } : {})
      }

      // if only banner Id is passed
      if (bannerId) {
        const bannerDetails = await bannerModel.findOne({
          where: { id: bannerId },
          inclide: {
            model: bannerTypeModel,
            attributes: ['id', 'type']
          }
        })

        return bannerDetails
      }

      const banners = await bannerModel.findAll({
        attributes: { exclude: ['type', 'updatedAt'] },

        where: { ...filters },
        ...((page && perPage) ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[orderBy || 'orderId', order || 'asc']],
        include: {
          model: bannerTypeModel,
          attributes: ['id', 'type']
        }
      })

      // count the banners
      const bannersCount = await bannerModel.count({
        attributes: { exclude: ['type', 'updatedAt'] },
        where: { ...filters }
      })

      return { banners, totalPages: Math.ceil(bannersCount / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
