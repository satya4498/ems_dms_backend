import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { PAYMENT_PROVIDER_CATEGORY } from '@src/utils/constants/payment.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    minDeposit: { type: 'number' },
    maxDeposit: { type: 'number' },
    minWithdraw: { type: 'number' },
    maxWithdraw: { type: 'number' },
    name: { type: 'object' },
    aggregator: { type: 'string' },
    category: { type: 'string', enum: Object.values(PAYMENT_PROVIDER_CATEGORY) },
    image: { type: 'object' },
    withdrawImage: { type: 'object' },
    description: { type: 'object' },
    blockedCountries: { type: 'array' },
    depositAllowed: { type: 'boolean' },
    withdrawAllowed: { type: 'boolean' },
    providerLimit: { type: 'array' }
  },
  required: ['name', 'description', 'category', 'aggregator']
})

export class CreatePaymentProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction

    try {
      const image = this.args.image
      let providerLimit = this.args.providerLimit

      const paymentProvider = await this.context.sequelize.models.paymentProvider.create({
        name: this.args.name,
        aggregator: this.args.aggregator,
        category: this.args.category,
        description: this.args.description,
        blockedCountries: this.args.blockedCountries,
        depositAllowed: this.args.depositAllowed,
        withdrawAllowed: this.args.withdrawAllowed
      }, { transaction })

      if (image) {
        const depositFileLocation = await uploadFile(image.buffer, {
          name: image.originalname,
          mimetype: image.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.paymentProvider
        })
        paymentProvider.image = depositFileLocation
      }
      await paymentProvider.save({ transaction })

      providerLimit = providerLimit.map(limit => ({
        ...limit,
        providerId: paymentProvider.id
      }))
      await this.context.sequelize.models.providerLimit.bulkCreate(providerLimit, { transaction })

      return { messages: 'Payment created successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
