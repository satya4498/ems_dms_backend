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
    categoryId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object'},
    desktopFile: {type: "object"},
    isActive: { type: 'string'}
  },
  required: ['categoryId']
})

export class EditCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args:{name, mobileFile, desktopFile, isActive},
    } = this
    const transaction = this.context.sequelizeTransaction
    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('SubCategoryNotFoundErrorType')
      let fileLocation=''
      if (name) {
        category.name = await getLanguageWiseNameJson(name, category.name)
        category.changed('name', true)
      }
      if (mobileFile && Object.keys(mobileFile).length > 0) {
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `category_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.categories
        })
        category.mobileThumbnailUrl = fileLocation
      }
      
      if(isActive) category.isActive = isActive

      if (desktopFile && Object.keys(desktopFile).length > 0) {
        fileLocation = await uploadFile(desktopFile.buffer, {
          name:`category_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.categories
        })
        category.iconUrl = fileLocation
      }

      await category.save({ transaction })

      return { category }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
