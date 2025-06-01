import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string'}
  },
  required: ['id']
})

/**
 *  create a segment
 */
export class DeleteSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { id  },
      context: { models: { segmentation: segmentationModel, tag:tagModel } }
    } = this

    try {

      // check the segment
      const segment = await segmentationModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { id }
      })

      // if exists throw error
      if(!segment) return this.addError('SegmentDoesNotExistsErrorType')

      const tag = await tagModel.findOne( { where: {tag:{[Op.iLike]:segment?.name} } })
      if(tag){
        await tagModel.destroy({
          where : { id: tag.id }
        })
      }
      // delete a segment
      await segmentationModel.destroy(
        {
          where : { id }
        }
      )

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
