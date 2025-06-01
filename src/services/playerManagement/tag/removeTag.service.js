import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    userIds: { type: 'array' }
  },
  required: ['userIds', 'tagId']
})

export class RemoveTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const segmentations = await this.context.sequelize.models.segmentation.findAll({
        attributes: ['name'],
        raw: true
      })

      const segmentationNames = segmentations && segmentations.map(segment => segment?.name)

      const checkUserTag = await this.context.sequelize.models.tag.findOne({
      where:{
        [Op.and]: [
          { tag: { [Op.in]: segmentationNames } },
          { id: this.args.tagId }
        ]
      }
      })
      if (checkUserTag) return this.addError('TagIsNotAttachedErrorType')

      const userTag = await this.context.sequelize.models.userTag.destroy({ where: { userId: { [Op.in]: this.args.userIds }, tagId: this.args.tagId } })
      if (!userTag) return this.addError('TagIsNotAttachedErrorType')

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
