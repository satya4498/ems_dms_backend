import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'object' },
    type: { enum: Object.values(S3FolderHierarchy.sportsbookHirerachyTypeMap) }
  },
  required: ['id', 'file', 'type']
})

export class UploadIconsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file
    const type = this.args.type
    const id = this.args.id

    const modelMap = {
      [S3FolderHierarchy.sportsbookHirerachyTypeMap.sports]: {
        fieldName: 'providerId',
        model: this.context.sequelize.models.sport
      },
      [S3FolderHierarchy.sportsbookHirerachyTypeMap.leagues]: {
        fieldName: 'name',
        model: this.context.sequelize.models.league
      },
      [S3FolderHierarchy.sportsbookHirerachyTypeMap.locations]: {
        fieldName: 'name',
        model: this.context.sequelize.models.location
      }
    }

    try {
      const modelType = modelMap[type]
      if (!modelType) return this.addError('InvalidSportsbookIconTypeErrorType')

      const entity = await modelType.model.findOne({ where: { id } })
      if (!entity) return this.addError('InvalidIdErrorType')

      const fileLocation = await uploadFile(file.buffer, {
        name: entity[modelType.fieldName],
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.sportsbook[type]
      })

      return { fileLocation }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
