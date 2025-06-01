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
    gameId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object' },
    desktopFile: {type: 'object'},
    newProviderId: { type: 'string' },
    newCategoryId: { type: 'string' },
    setDefaultImage: {type: 'boolean'},
    isActive: { type: 'string'},
    isFeatured: { type: 'string' }
  },
  required: ['gameId']
})

export class EditGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args: { mobileFile, desktopFile, name, newProviderId, newCategoryId, setDefaultImage , isActive, isFeatured},
      context: { sequelizeTransaction: transaction }
    } = this;

    try {
      let fileLocation=''
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, transaction })
      if (!game) return this.addError('GameNotFoundErrorType')

      if (newProviderId) {
        const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: newProviderId }, transaction })
        if (!provider) return this.addError('ProviderNotFoundErrorType')

        game.casinoProviderId = provider.id
      }
      if (newCategoryId) {
        const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: newCategoryId }, transaction })
        if (!category) return this.addError('SubCategoryNotFoundErrorType')

        game.casinoCategoryId = category.id
      }
      if (name) {
        game.name = await getLanguageWiseNameJson(name, game.name)
        game.changed('name', true)
      }
       if (mobileFile && Object.keys(mobileFile).length > 0) {
          fileLocation = await uploadFile(mobileFile.buffer, {
          name: `provider_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.games
        })
          game.mobileImageUrl = fileLocation
      }
                  
                  
      if (desktopFile && Object.keys(desktopFile).length > 0) {
          fileLocation = await uploadFile(desktopFile.buffer, {
          name:`provider_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.games
        })
          game.desktopImageUrl = fileLocation
      }

      if(setDefaultImage){
        game.mobileImageUrl=null
        game.desktopImageUrl=null
      }
      if(isActive==='true') game.isActive=true
      if(isActive==='false') game.isActive=false

      if(isFeatured==='true') game.isFeatured=true
      if(isFeatured==='false') game.isFeatured=false
      await game.save({ transaction })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
