import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { deleteFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bannerId: { type: 'string' }
  },
  required: ['bannerId']
})

export class DeleteBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const {
        args: { bannerId },
        context: { models: { banner: bannerModel } }
      } = this

      const banner = await bannerModel.findOne({ where: { id: bannerId } })
      if (!banner) return this.addError('BannerNotFoundErrorType')

      // delete the files from the s3
      if (banner.desktopImageUrl) await deleteFile(banner.desktopImageUrl, S3FolderHierarchy.banner)
      if (banner.mobileImageUrl) await deleteFile(banner.mobileImageUrl, S3FolderHierarchy.banner)

      await banner.destroy()

      return banner
    } catch (error) {
      throw new APIError(error)
    }
  }
}
