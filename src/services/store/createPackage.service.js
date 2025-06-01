import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    amount: { type: 'number', default: 0.0 },
    lable: { type: 'string' },
    gcCoin: { type: 'number', default: 0 },
    scCoin: { type: 'number', default: 0 },
    isActive: { type: 'boolean', default: false },
    isVisibleInStore: { type: 'boolean', default: false },
    image: { type: 'object' },
    validTill: { type: 'string', format: 'date-time' },
    validFrom: { type: 'string', format: 'date-time' },
    customizationSettings: { type: 'object' },
    maxPurchasePerUser: { type: 'integer' },
    discountAmount: { type: 'number', default: 0.0 },
    discountEndDate: { type: 'string', format: 'date-time' },
    pricingTiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          purchases: { type: 'integer' },
          price: { type: 'number' }
        },
        required: ['purchases', 'price']
      },
      additionalProperties: false
    },
    bonusId: { type: 'integer' },
    giftable: { type: 'boolean', default: false },
  },
  required: ['lable', 'amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore'],
})

export class CreatePackageService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      amount,
      lable,
      gcCoin,
      scCoin,
      isActive,
      isVisibleInStore,
      image,
      orderId,
      validTill,
      validFrom,
      customizationSettings,
      maxPurchasePerUser,
      discountAmount,
      discountEndDate,
      pricingTiers,
      bonusId,
      giftable
    } = this.args

    try {
      // Check if a package with the same orderId exists
      let existingPackage = await this.context.sequelize.models.package.findOne({ where: { lable } })
      if (existingPackage) return this.addError('PackageAlreadyExistsErrorType')

      // Create the new package
      const sweepPackage = await this.context.sequelize.models.package.create({
        amount,
        lable,
        gcCoin,
        scCoin,
        isActive,
        isVisibleInStore,
        orderId,
        validTill,
        validFrom,
        customizationSettings,
        maxPurchasePerUser,
        discountAmount,
        discountEndDate,
        pricingTiers,
        bonusId,
        giftable
      })

      if (image) {
        const fileLocation = await uploadFile(image.buffer, {
          name: sweepPackage.id.toString(),
          mimetype: image.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.store.package
        })
        sweepPackage.imageUrl = fileLocation
        await sweepPackage.save()
      }


      return { sweepPackage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
