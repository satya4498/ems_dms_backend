import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { deleteFile, uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    mobileFile: { type: ['object', 'null'] },
    desktopFile: { type: ['object', 'null'] },
    bannerId: { type: 'string' },
    description: { type: ['object', 'null'] },
    isActive: { type: 'string' },
    redirectionUrl: { type: 'string' }
  },
  required: ['bannerId']
})

export class updateBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args: { mobileFile, desktopFile, isActive, description, bannerId, redirectionUrl },
      context: { models: { banner: bannerModel } }
    } = this
    let fileLocation = ''
    try {
      const existingBanner = await bannerModel.findOne({ where: { id: bannerId } })
      if (!existingBanner) return this.addError('BannerNotFoundErrorType')

      // data to be updates
      const updateBanner = {
        ...(description ? { description: await getLanguageWiseNameJson(description) } : {}),
        ...(isActive ? { isActive } : {})
      }

      // add mobile image
      if (mobileFile) {
        // delete the existing image
        if (existingBanner.mobileImageUrl) await deleteFile(existingBanner.mobileImageUrl, S3FolderHierarchy.banner)
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `banner_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
        updateBanner.mobileImageUrl = fileLocation
      }

      // add desktop image
      if (desktopFile) {
        // delete the existing image
        if (existingBanner.desktopImageUrl) await deleteFile(existingBanner.desktopImageUrl, S3FolderHierarchy.banner)
        fileLocation = await uploadFile(desktopFile.buffer, {
          name: `banner_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
        updateBanner.desktopImageUrl = fileLocation
      }

      if (redirectionUrl) {
        const isValidUrl = redirectionUrl.startsWith('http://') || redirectionUrl.startsWith('https://')
        if (!isValidUrl) return this.addError('InvalidRedirectionUrl')
        updateBanner.redirectionUrl = redirectionUrl
      }

      const updatedBanner = await bannerModel.update(updateBanner, { where: { id: bannerId } })

      return { updatedBanner }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
