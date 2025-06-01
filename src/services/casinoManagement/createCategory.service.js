import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'object' },
    mobileFile: { type: 'object'},
    desktopFile: {type: "object"},
    uniqueId: { type: 'string' },
    isActive: { type: 'boolean', default: true }
  },
  required: [ 'name','uniqueId']
})

export class CreateCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const mobileFile = this.args.mobileFile
    const desktopFile=this.args.desktopFile
    const uniqueId = this.args.uniqueId

    console.log(mobileFile, desktopFile)

    const transaction = this.context.sequelizeTransaction
    const casinoSubCategoryModel = this.context.sequelize.models.casinoCategory
    try {

      const CategoryExists = await casinoSubCategoryModel.findOne({ where: { [Op.or]:{'name.EN': this.args.name.EN , uniqueId} }, transaction })
      if (CategoryExists) return this.addError('SubCategoryAlreadyExistsErrorType')
      let fileLocation=''
      const name = await getLanguageWiseNameJson(this.args.name)
      const category = await casinoSubCategoryModel.create({
        name,
        uniqueId,
        isActive: this.args.isActive
      }, { transaction })

      if (mobileFile && Object.keys(mobileFile).length > 0) {
              fileLocation = await uploadFile(mobileFile.buffer, {
                name: `category_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
                mimetype: mobileFile.mimetype,
                filePathInS3Bucket: S3FolderHierarchy.casino.categories
              })
              category.mobileThumbnailUrl = fileLocation
            }
            
            
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
