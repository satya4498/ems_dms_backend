import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { PAYMENT_PROVIDER_CATEGORY } from '@src/utils/constants/payment.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerId: { type: 'number' },
    minDeposit: { type: 'number' },
    maxDeposit: { type: 'number' },
    minWithdraw: { type: 'number' },
    maxWithdraw: { type: 'number' },
    name: { type: 'object' },
    aggregator: { type: 'string' },
    category: { type: 'string', enum: Object.values(PAYMENT_PROVIDER_CATEGORY) },
    image: { type: 'object' },
    description: { type: 'object' },
    blockedCountries: { type: 'array' },
    depositAllowed: { type: 'boolean' },
    withdrawAllowed: { type: 'boolean' },
    providerLimit: { type: 'array' }
  },
  required: ['name', 'description', 'category', 'aggregator']
})

export class UpdatePaymentProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction

    try {
      const image = this.args.image
      let providerLimit = this.args.providerLimit

      const paymentProvider = await this.context.sequelize.models.paymentProvider.findOne({
        where: { id: this.args.providerId }
      })
      if (!paymentProvider) return this.addError('PaymentProviderNotExistErrorType')

      paymentProvider.name = this.args.name
      paymentProvider.aggregator = this.args.aggregator
      paymentProvider.category = this.args.category
      paymentProvider.description = this.args.description
      paymentProvider.blockedCountries = this.args.blockedCountries
      paymentProvider.depositAllowed = this.args.depositAllowed
      paymentProvider.withdrawAllowed = this.args.withdrawAllowed
      if (image) {
        const depositFileLocation = await uploadFile(image.buffer, {
          name: image.originalname,
          mimetype: image.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.paymentProvider
        })
        paymentProvider.image = depositFileLocation
      }
      await paymentProvider.save({ transaction })
      await this.context.sequelize.models.providerLimit.destroy({ where: { providerId: this.args.providerId } }, { transaction })
      if (providerLimit) {
        providerLimit = providerLimit.map(limit => ({
          ...limit,
          providerId: paymentProvider.id
        }))
        await this.context.sequelize.models.providerLimit.bulkCreate(providerLimit, { transaction })
      }

      return { messages: 'Payment updated successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
