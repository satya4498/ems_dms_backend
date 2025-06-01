import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import { uploadFile } from '@src/libs/s3'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gamificationId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'object' },
    iconImage: { type: 'object' }
  },
  required: ['gamificationId']
})

export class UpdateGamificationDataService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { gamificationId, name, description, iconImage } = this.args

    try {
      const gamificationModel = this.context.sequelize.models.gamification

      const gamificationData = await gamificationModel.findOne({
        where: { id: gamificationId },
        transaction
      })

      if (!gamificationData) {
        return this.addError('GamificationIdInvalid')
      }

      const updatePayload = {}

      if (!_.isUndefined(name)) updatePayload.name = name
      if (!_.isUndefined(description)) {
        updatePayload.description = await getLanguageWiseNameJson(description)
      }
      if (!_.isUndefined(iconImage)) {
        const fileLocation = await uploadFile(iconImage.buffer, {
          name: `gamification_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: iconImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.gamification.task
        })
        updatePayload.imageUrl = fileLocation
      }

      if (_.isEmpty(updatePayload)) {
        return this.addError('NoFieldsToUpdate')
      }

      const gamification = await gamificationModel.update(updatePayload, {
        where: { id: gamificationId },
        transaction
      })

      return { success: true, gamification }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
