import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    mobileFile: { type: 'object' },
    desktopFile: { type: 'object' },
    bannerTypeId: { type: 'string' },
    description: { type: 'object' },
    redirectionUrl: { type: 'string' }
  },
  required: ['bannerTypeId', 'desktopFile', 'mobileFile']
})

export class createBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args: { mobileFile, desktopFile, bannerTypeId, description, redirectionUrl },
      context: { models: { banner: bannerModel, bannerTypes: bannerTypeModel } }
    } = this

    // console.log(req.context.models)

    let fileLocation = ''

    try {
      const bannerType = await bannerTypeModel.findOne({ where: { id: bannerTypeId } })
      if (!bannerType) return this.addError('BannerNotFoundErrorType')

      const banner = {
        bannerTypeId,
        description: await getLanguageWiseNameJson(description),
        isActive: true,
        orderId: parseInt(await (bannerModel.max('orderId', { where: { bannerTypeId } })) || 0) + 1
      }

      // add mobile image
      if (mobileFile) {
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `banner_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
      }
      banner.mobileImageUrl = fileLocation

      // add desktop image
      if (desktopFile) {
        fileLocation = await uploadFile(desktopFile.buffer, {
          name: `banner_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
      }
      banner.desktopImageUrl = fileLocation

      if(redirectionUrl) {
        let isValidUrl = redirectionUrl.startsWith('http://') || redirectionUrl.startsWith('https://')
        if(!isValidUrl) return this.addError('InvalidRedirectionUrl')
        banner.redirectionUrl = redirectionUrl   
      }

      await bannerModel.create(banner)

      return { banner }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
