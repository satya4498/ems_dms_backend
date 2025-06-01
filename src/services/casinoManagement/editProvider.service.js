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
    providerId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object'},
    desktopFile: {type: "object"},
    newAggregatorId: { type: 'string' }
  },
  required: ['providerId']
})

export class EditProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args:{name, mobileFile, desktopFile, newAggregatorId},
    } = this

    const transaction = this.context.sequelizeTransaction

    try {
      let fileLocation=''
      const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: this.args.providerId }, transaction })
      if (!provider) return this.addError('ProviderNotFoundErrorType')

      if (newAggregatorId) {
        const aggregator = await this.context.sequelize.models.casinoAggregator.findOne({ where: { id: newAggregatorId }, transaction })
        if (!aggregator) return this.addError('AggregatorNotFoundErrorType')

        provider.casinoAggregatorId = aggregator.id
      }
      if (name) {
        provider.name = await getLanguageWiseNameJson(name, provider.name)
        provider.changed('name', true)
      }
       if (mobileFile && Object.keys(mobileFile).length > 0) {
              fileLocation = await uploadFile(mobileFile.buffer, {
                name: `provider_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
                mimetype: mobileFile.mimetype,
                filePathInS3Bucket: S3FolderHierarchy.casino.providers
              })
              provider.mobileThumbnailUrl = fileLocation
            }
            
            
            if (desktopFile && Object.keys(desktopFile).length > 0) {
              fileLocation = await uploadFile(desktopFile.buffer, {
                name:`provider_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
                mimetype: desktopFile.mimetype,
                filePathInS3Bucket: S3FolderHierarchy.casino.providers
              })
              provider.iconUrl = fileLocation
            }

      await provider.save({ transaction })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
