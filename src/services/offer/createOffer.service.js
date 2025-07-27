import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const createOfferConstraints = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string', maxLength: 1000 },
    price: { type: 'number', minimum: 0 },
    productName: { type: 'string', maxLength: 255 },
    productCategory: { type: 'string', enum: ['Royal', 'Ultima', 'Regular'] },
    userId: { type: 'string' },
    createdBy: { type: 'string' },
    validFrom: { type: 'string', format: 'date-time' },
    validTo: { type: 'string', format: 'date-time' },
    isActive: { type: 'boolean', default: true }
  },
  required: ['title', 'createdBy']
})

export class CreateOfferService extends ServiceBase {
  get constraints () {
    return createOfferConstraints
  }

  async run () {
    try {
      const { title, description, userId, createdBy, validFrom, validTo, isActive = true, price, productCategory, productName } = this.args

      // Check if creator exists and has admin role
      const creator = await this.context.sequelize.models.user.findOne({
        where: { id: createdBy, role: 'admin' }
      })
      if (!creator) {
        throw new APIError('Admin not found or insufficient permissions')
      }

      // If userId is provided, check if user exists
      if (userId) {
        const user = await this.context.sequelize.models.user.findByPk(userId)
        if (!user) {
          return this.addError('UserNotFoundErrorType', 'User not found')
        }
      }

      // Create the offer
      const offer = await this.context.sequelize.models.offer.create({
        title,
        description,
        price,
        productCategory,
        productName,
        userId,
        createdBy,
        validFrom: validFrom ? new Date(validFrom) : null,
        validTo: validTo ? new Date(validTo) : null,
        isActive
      })

      // Fetch the created offer with related data
      const offerWithDetails = await this.context.sequelize.models.offer.findOne({
        where: { id: offer.id },
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

      this.log.info('Offer Created', {
        message: 'Offer created successfully',
        context: { offerId: offer.id, createdBy, title }
      })

      return {
        offer: offerWithDetails,
        message: 'Offer created successfully'
      }
    } catch (err) {
      this.log.error('Offer Creation Failed', {
        message: err.message,
        context: { createdBy: this.args.createdBy },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
