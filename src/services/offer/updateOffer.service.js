import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const updateOfferConstraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string', maxLength: 1000 },
    userId: { type: 'string' },
    updatedBy: { type: 'string' },
    validFrom: { type: 'string', format: 'date-time' },
    validTo: { type: 'string', format: 'date-time' },
    isActive: { type: 'boolean' }
  },
  required: ['id', 'updatedBy']
})

export class UpdateOfferService extends ServiceBase {
  get constraints () {
    return updateOfferConstraints
  }

  async run () {
    try {
      const { id, title, description, userId, updatedBy, validFrom, validTo, isActive } = this.args

      // Check if updater exists and has admin role
      const updater = await this.context.sequelize.models.user.findOne({
        where: { id: updatedBy, role: 'admin' }
      })
      if (!updater) {
        throw new APIError('Admin not found or insufficient permissions')
      }

      // Check if offer exists
      const existingOffer = await this.context.sequelize.models.offer.findByPk(id)
      if (!existingOffer) {
        throw new APIError('Offer not found')
      }

      // If userId is provided, check if user exists
      if (userId) {
        const user = await this.context.sequelize.models.user.findByPk(userId)
        if (!user) {
          throw new APIError('Target user not found')
        }
      }

      // Prepare update data
      const updateData = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (userId !== undefined) updateData.userId = userId
      if (validFrom !== undefined) updateData.validFrom = validFrom ? new Date(validFrom) : null
      if (validTo !== undefined) updateData.validTo = validTo ? new Date(validTo) : null
      if (isActive !== undefined) updateData.isActive = isActive

      // Update the offer
      await existingOffer.update(updateData)

      // Fetch the updated offer with related data
      const updatedOffer = await this.context.sequelize.models.offer.findOne({
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

      this.log.info('Offer Updated', {
        message: 'Offer updated successfully',
        context: { offerId: id, updatedBy, updatedFields: Object.keys(updateData) }
      })

      return {
        offer: updatedOffer,
        message: 'Offer updated successfully'
      }
    } catch (err) {
      this.log.error('Offer Update Failed', {
        message: err.message,
        context: { offerId: this.args.id, updatedBy: this.args.updatedBy },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
