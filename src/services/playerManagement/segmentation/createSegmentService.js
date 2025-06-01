import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { requestInputValidation } from '@src/helpers/segmentation.helper'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string', transform: ['trim'] },
    comments: { type: 'string', transform: ['trim'] },
    condition: { type: 'array',
      items: {
        type: 'object',
      }
    },

  },
  required: ['name', 'comments', 'condition']
})

/**
 *  create a segment
 */
export class CreateSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { name, comments, condition },
      context: { models: { segmentation: segmentationModel, tag:tagModel } }
    } = this

    try {

      // check condition object here
      const validateCondition = requestInputValidation(condition)
      if(validateCondition?.length>0) return new RequestInputValidationError(validateCondition)
      // check segment with the name exists
      const segment = await segmentationModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { name:{ [Op.iLike]: name } }
      })
      const tags = await tagModel.findOne({ where:{ tag:{ [Op.iLike]: name } } })
      // if exists throw error
      if(segment) return this.addError('SegmentNameAlreadyExistsErrorType')

      if(!tags){
         await tagModel.create({
          tag:name,
        })
      }
      // insert the segment ddata
      const createdSegment = await segmentationModel.create({
        name,
        comments,
        condition
      })

      return { success: true, segmentDetail: createdSegment }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
