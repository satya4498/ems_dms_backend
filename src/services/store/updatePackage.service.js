import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'integer' },
    amount: { type: 'number' },
    lable: { type: 'string' },
    gcCoin: { type: 'number' },
    scCoin: { type: 'number' },
    isActive: { type: 'boolean' },
    isVisibleInStore: { type: 'boolean'},
    image: { type: 'object' },
    validTill: { type: 'string', format: 'date-time' },
    validFrom: { type: 'string', format: 'date-time' },
    customizationSettings: { type: 'object' },
    maxPurchasePerUser: { type: 'integer' },
    discountAmount: { type: 'number' },
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
      }
    },
    bonusId: { type: 'integer' },
    giftable: { type: 'boolean' },
  },
  required: ['id'],
  additionalProperties: false
})

export class UpdatePackageService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      id,
      amount,
      lable,
      gcCoin,
      scCoin,
      isActive,
      isVisibleInStore,
      image,
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
    const transaction = this.context.sequelizeTransaction
    try {
      // Fetch the existing package
      const packageToUpdate = await this.context.sequelize.models.package.findOne({ where: { id }, transaction })
      if (!packageToUpdate) {
        return this.addError('PackageNotFoundErrorType')
      }

      // Prepare updates
      const updateData = {
        amount: amount ?? packageToUpdate.amount,
        lable: lable ?? packageToUpdate.lable,
        gcCoin: gcCoin ?? packageToUpdate.gcCoin,
        scCoin: scCoin ?? packageToUpdate.scCoin,
        isActive: isActive ?? packageToUpdate.isActive,
        isVisibleInStore: isVisibleInStore ?? packageToUpdate.isVisibleInStore,
        validTill: validTill ?? packageToUpdate.validTill,
        validFrom: validFrom ?? packageToUpdate.validFrom,
        customizationSettings: customizationSettings ?? packageToUpdate.customizationSettings,
        maxPurchasePerUser: maxPurchasePerUser ?? packageToUpdate.maxPurchasePerUser,
        discountAmount: discountAmount ?? packageToUpdate.discountAmount,
        discountEndDate: discountEndDate ?? packageToUpdate.discountEndDate,
        pricingTiers: pricingTiers ?? packageToUpdate.pricingTiers,
        bonusId: bonusId ?? packageToUpdate.bonusId,
        giftable: giftable ?? packageToUpdate.giftable
      }

      // Handle image upload if provided
      if (image) {
        const fileLocation = await uploadFile(image.buffer, {
          name: id.toString(),
          mimetype: image.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.store.package
        })
        updateData.imageUrl = fileLocation
      }

      // Update the package
      await packageToUpdate.update(updateData, { transaction })

      return { packageToUpdate }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
