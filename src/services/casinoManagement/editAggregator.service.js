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
    aggregatorId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object'},
    desktopFile: {type: "object"}
  },
  required: ['aggregatorId']
})

export class EditAggregatorService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
        args:{name, mobileFile, desktopFile},
      } = this  
    const transaction = this.context.sequelizeTransaction
    let fileLocation=''
    try {
      const aggregator = await this.context.sequelize.models.casinoAggregator.findOne({ where: { id: this.args.aggregatorId }, transaction })
      if (!aggregator) return this.addError('InvalidAggregatorType')

      if (name) {
        aggregator.name = await getLanguageWiseNameJson(name, aggregator.name)
        aggregator.changed('name', true)
      }
      
      const folderPath = `${S3FolderHierarchy.casino}aggregators/`;
      if (mobileFile && Object.keys(mobileFile).length > 0) {
        
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `aggregator_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: folderPath
        })
        aggregator.mobileThumbnailUrl = fileLocation
      }
      
      
      if (desktopFile && Object.keys(desktopFile).length > 0) {
        fileLocation = await uploadFile(desktopFile.buffer, {
          name:`aggregator_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: folderPath
        })
        aggregator.desktopThumbnailUrl = fileLocation
      }


      await aggregator.save({ transaction })

      return { aggregator }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
