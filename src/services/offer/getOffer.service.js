import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const getOfferConstraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id']
})

export class GetOfferService extends ServiceBase {
  get constraints () {
    return getOfferConstraints
  }

  async run () {
    try {
      const { id } = this.args

      // Get offer with related data
      const offer = await this.context.sequelize.models.offer.findOne({
        where: { id },
        include: [
          {
            model: this.context.sequelize.models.user,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: this.context.sequelize.models.user,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      })

      if (!offer) {
        throw new APIError('Offer not found')
      }

      this.log.info('Offer Retrieved', {
        message: 'Offer retrieved successfully',
        context: { offerId: id }
      })

      return {
        offer,
        message: 'Offer retrieved successfully'
      }
    } catch (err) {
      this.log.error('Get Offer Failed', {
        message: err.message,
        context: { offerId: this.args.id },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
