import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { requestInputValidation } from '@src/helpers/segmentation.helper'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'number'},
    name: { type: 'string', transform: ['trim']},
    comments: { type: 'string', transform: ['trim'] },
    condition: { type: 'array',
      items: {
        type: 'object',
      }
    },
  },
  required: ['id', 'name', 'comments', 'condition']
})

/**
 *  create a segment
 */
export class EditSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { id, name, comments, condition },
      context: { models: { segmentation: segmentationModel, tag:tagModel } }
    } = this

    try {

      // check condition object here
      const validateCondition = requestInputValidation(condition)
      if(validateCondition?.length>0) return new RequestInputValidationError(validateCondition)
      // check segment with the name exists
      if(name){
        const segment = await segmentationModel.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { name, id: { [Op.ne]: id}}
        })

         // if exists throw error
        if(segment) return this.addError('SegmentNameAlreadyExistsErrorType')
      }
      if(name){
        const segmentData = await segmentationModel.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { id: { [Op.eq]: id}}
        })

        const tag = await tagModel.findOne({ where:{ tag:{ [Op.iLike]: segmentData?.name } } })
        if(tag){
          await tagModel.update({
            tag: name
          },{
            where: {
            id: tag?.id,
          }
        })
        }
      }
      // insert the segment data
      const updatedSegment = await segmentationModel.update({
        ...(name ? { name } : {} ),
        ...(comments ? { comments } : {} ),
        ...(condition ? { condition } : {} ),

      },{
        where: { id }
      })

      return { success: true, segmentDetail: updatedSegment }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
