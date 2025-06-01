import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { deleteFile, uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    file: { type: 'object' },
    bannerId: { type: 'string' }
  },
  required: ['bannerId', 'file']
})

export class UploadBannerImageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file

    try {
      const banner = await this.context.sequelize.models.banner.findOne({ where: { id: this.args.bannerId } })
      if (!banner) return this.addError('BannerNotFoundErrorType')
      if (banner.imageUrl !== '') await deleteFile(banner.imageUrl, S3FolderHierarchy.banner)

      const fileLocation = await uploadFile(file.buffer, {
        name: banner.type,
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.banner
      })
      banner.imageUrl = fileLocation
      await banner.save()

      return { banner }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
