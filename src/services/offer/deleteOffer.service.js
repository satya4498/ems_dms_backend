import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const deleteOfferConstraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    deletedBy: { type: 'string' }
  },
  required: ['id', 'deletedBy']
})

export class DeleteOfferService extends ServiceBase {
  get constraints () {
    return deleteOfferConstraints
  }

  async run () {
    try {
      const { id, deletedBy } = this.args

      // Check if deleter exists and has admin role
      const deleter = await this.context.sequelize.models.user.findOne({
        where: { id: deletedBy, role: 'admin' }
      })
      if (!deleter) {
        throw new APIError('Admin not found or insufficient permissions')
      }

      // Check if offer exists
      const existingOffer = await this.context.sequelize.models.offer.findByPk(id)
      if (!existingOffer) {
        throw new APIError('Offer not found')
      }

      // Delete the offer
      await existingOffer.destroy()

      this.log.info('Offer Deleted', {
        message: 'Offer deleted successfully',
        context: { offerId: id, deletedBy, title: existingOffer.title }
      })

      return {
        message: 'Offer deleted successfully'
      }
    } catch (err) {
      this.log.error('Offer Deletion Failed', {
        message: err.message,
        context: { offerId: this.args.id, deletedBy: this.args.deletedBy },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
