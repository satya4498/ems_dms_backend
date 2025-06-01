import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { CreateFreespinBonusService } from '@src/services/bonus/createFreespinBonus.service'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { CreatePurchaseBonusService } from '@src/services/bonus/createPurchaseBonus.service'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    gameIds: { type: 'array' },
    quantity: { type: 'number', minimum: 1 },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          joiningAmount: { type: 'number', minimum: 1 },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number' },
          minDepositAmount: { type: 'number' },
          wageringAmount: { type: 'number' },
          amount: { type: 'number' },
          loosingAmount: { type: 'number' },
          bonusAmount: { type: 'number' },
          rakeBackAmount: { type: 'number' }
        },
        required: ['currencyId'],
        additionalProperties: false
      }
    },
    validFrom: { type: 'string' },
    validTo: { type: 'string' },
    validOnDays: { type: 'string' },
    bonusImage: { type: 'object' },
    description: { type: 'object' },
    daysToClear: { type: 'string' },
    termAndCondition: { type: 'object' },
    appliedBonusId: { type: 'string' },
    promotionTitle: { type: 'object' },
    wageringTemplateId: { type: 'string' },
    percentage: { type: 'number' },
    packageIds: { type: 'array', items: { type: 'number' } },
    visibleInPromotions: { type: 'boolean' },
    tagIds: { type: 'array' },
    amount: { type: 'number' },
    loosingAmount: { type: 'number' },
    maxCouponClaims: { type: 'number' },
    couponCode: { type: 'string' },
    isActive: { type: 'boolean' },
    promoCode: { type: 'string' }
  },
  required: ['bonusId']
})

const BONUS_SERVICE_MAP = {
  [BONUS_TYPES.PURCHASE]: CreatePurchaseBonusService,
  [BONUS_TYPES.FREESPINS]: CreateFreespinBonusService
}

export class UpdateBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      bonusId,
      validFrom,
      isActive,
      validTo,
      validOnDays,
      bonusImage,
      daysToClear,
      visibleInPromotions,
      couponCode,
      percentage,
      tagIds,
      packageIds,
      promoCode
    } = this.args

    const { sequelizeTransaction: transaction } = this.context
    let { bonus, bonusCurrency } = this.context.sequelize.models

    try {
      const existingBonus = await bonus.findOne({
        where: { id: bonusId },
        include: [{
          model: bonusCurrency
        }],
        transaction
      })

      if (!existingBonus) return this.addError('BonusDoesNotExistsErrorType')
      if (_.isBoolean(isActive)) existingBonus.isActive = isActive
      existingBonus.promotionTitle = _.merge(
        existingBonus.promotionTitle,
        await getLanguageWiseNameJson(this.args.promotionTitle)
      )
      existingBonus.termAndCondition = _.merge(
        existingBonus.termAndCondition,
        await getLanguageWiseNameJson(this.args.termAndCondition)
      )
      existingBonus.description = _.merge(
        existingBonus.description,
        await getLanguageWiseNameJson(this.args.description)
      )
      existingBonus.changed('promotionTitle', true)
      existingBonus.changed('termAndCondition', true)
      existingBonus.changed('description', true)

      existingBonus.visibleInPromotions = visibleInPromotions
      if (couponCode) existingBonus.couponCode = couponCode
      if (promoCode) existingBonus.promoCode = promoCode
      if (
        !existingBonus.claimedCount ||
        existingBonus.bonusType === BONUS_TYPES.REFERRAL ||
        existingBonus.bonusType === BONUS_TYPES.JOINING ||
        existingBonus.bonusType === BONUS_TYPES.POSTAL_CODE ||
        existingBonus.bonusType === BONUS_TYPES.BIRTHDAY
      ) {
        if (this.args.currencyDetails) {
          const currencyDetails = await Promise.all(
            this.args.currencyDetails.map(async (currency) => {
              const currencyExists = await this.context.sequelize.models.currency.findOne({
                where: { id: currency.currencyId }
              })
              if (currencyExists) {
                currency.bonusId = existingBonus.id
                currency.metaData = {
                  ...(currency.metaData || {}),
                  ...(currency.amount ? { amount: currency.amount } : {}),
                  ...(currency.loosingAmount ? { loosingAmount: currency.loosingAmount } : {}),
                  ...(currency.bonusAmount ? { bonusAmount: currency.bonusAmount } : {}),
                  ...(currency.rakeBackAmount ? { rakeBackAmount: currency.rakeBackAmount } : {})
                }
                return currency
              }
              return null
            })
          )

          if (_.includes(currencyDetails, null)) return this.addError('InvalidCurrencyDetailsErrorType')

          await bonusCurrency.bulkCreate(currencyDetails, {
            updateOnDuplicate: [
              'zeroOutThreshold',
              'joiningAmount',
              'maxBonusClaimed',
              'minBetAmount',
              'minDepositAmount',
              'wageringAmount',
              'minWageringAmount',
              'metaData'
            ],
            transaction
          })

          // NOTE: Delete currencies linked to the bonus that are NOT in the incoming payload
          const currencyIds = this.args.currencyDetails.map(c => c.currencyId)
          await bonusCurrency.destroy({
            where: {
              bonusId: existingBonus.id,
              currencyId: {
                [Op.notIn]: currencyIds
              }
            },
            transaction
          })
        }

        existingBonus.validFrom = validFrom || existingBonus.validFrom
        existingBonus.validTo = validTo || existingBonus.validTo
        existingBonus.validOnDays = validOnDays || existingBonus.validOnDays
        existingBonus.daysToClear = daysToClear || existingBonus.daysToClear
        existingBonus.wageringTemplateId = this.args.wageringTemplateId || existingBonus.wageringTemplateId
        existingBonus.tagIds = tagIds !== undefined ? tagIds : []
        existingBonus.maxCouponClaims = this.args.maxCouponClaims || existingBonus.maxCouponClaims
        existingBonus.packageIds = packageIds ? [...packageIds] : existingBonus.packageIds
        if (existingBonus.bonusType === BONUS_TYPES.COUPON_CODE) {
          existingBonus.metaData = {
            ...(existingBonus.metaData || {}),
            ...(percentage ? { bonusPercentage: percentage } : {})
          }
          existingBonus.changed('metaData', true)
        }
        const result = await BONUS_SERVICE_MAP[existingBonus.bonusType]?.execute(
          { ...this.args, bonusId: existingBonus.id },
          this.context
        )
        if (_.size(result?.errors)) return this.mergeErrors(result.errors)
      }

      if (bonusImage) {
        const fileLocation = await uploadFile(bonusImage.buffer, {
          name: existingBonus.id,
          mimetype: bonusImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.bonus
        })
        existingBonus.imageUrl = fileLocation
      }

      await existingBonus.save({ transaction })
      bonus = existingBonus
      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
