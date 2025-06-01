import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'
import { CreateFreespinBonusService } from './createFreespinBonus.service'
import { CreatePurchaseBonusService } from './createPurchaseBonus.service'
import { RakeBackBonusService } from './rakeBack.service'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isActive: { type: 'boolean' },
    validTo: { type: 'string' },
    quantity: { type: 'number', minimum: 1 },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          currencyId: { type: 'string', default: '1' },
          joiningAmount: { type: 'number', minimum: 1 },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number' },
          minDepositAmount: { type: 'number' },
          amount: { type: 'number' },
          bonusAmount: { type: 'number' },
          loosingAmount: { type: 'number' },
          wageringAmount: { type: 'number' },
          rakeBackAmount: { type: 'number' }
        },
        required: ['currencyId'],
        additionalProperties: false
      },
      default: [{ currencyId: '1' }]
    },
    validFrom: { type: 'string' },
    validOnDays: { type: 'string' },
    bonusImage: { type: 'object' },
    description: { type: 'object' },
    daysToClear: { type: 'string' },
    termAndCondition: { type: 'object' },
    promotionTitle: { type: 'object' },
    wageringTemplateId: { type: 'string' },
    percentage: { type: 'number' },
    packageIds: { type: 'array', items: { type: 'number' } },
    bonusType: { enum: Object.values(BONUS_TYPES) },
    gameIds: { type: 'array' },
    tagIds: { type: 'array' },
    visibleInPromotions: { type: 'boolean' },
    maxCouponClaims: { type: 'number' },
    couponCode: { type: 'string' },
    promoCode: { type: 'string' }
  },
  required: ['isActive', 'promotionTitle', 'bonusType', 'currencyDetails']
})

const BONUS_SERVICE_MAP = {
  [BONUS_TYPES.PURCHASE]: CreatePurchaseBonusService,
  [BONUS_TYPES.FREESPINS]: CreateFreespinBonusService
}

export class CreateBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const isActive = this.args.isActive
    const validTo = this.args.validTo
    const validFrom = this.args.validFrom
    const validOnDays = this.args.validOnDays
    const bonusImage = this.args.bonusImage
    const description = this.args.description
    const daysToClear = this.args.daysToClear
    const termAndCondition = this.args.termAndCondition
    const promotionTitle = this.args.promotionTitle
    const wageringTemplateId = this.args.wageringTemplateId
    const bonusType = this.args.bonusType
    const visibleInPromotions = this.args.visibleInPromotions
    const maxCouponClaims = this.args.maxCouponClaims
    const couponCode = this.args.couponCode
    const packageIds = this.args.packageIds
    const percentage = this.args.percentage
    const promoCode = this.args.promoCode
    const transaction = this.context.sequelizeTransaction

    try {
      if (wageringTemplateId) {
        const template = await this.context.sequelize.models.wageringTemplate.findOne({ where: { id: wageringTemplateId } })
        if (!template) return this.addError('WageringTemplateDoesNotExistsErrorType')
      }

      if ((bonusType === BONUS_TYPES.JOINING) && await this.context.sequelize.models.bonus.findOne({ where: { bonusType } })) return this.addError('JoiningBonusAlreadyExistErrorType')

      if (bonusType === BONUS_TYPES.REFERRAL) {
        const bonus = await this.context.sequelize.models.bonus.findOne({ where: { bonusType } })
        if (bonus) return this.addError('ReferralBonusAlreadyExistErrorType')
      }
      if (bonusType === BONUS_TYPES.PROMOCODE) {
        const bonus = await this.context.sequelize.models.bonus.findOne(
          {
            where: {
              [Op.or]: [{ bonusType: bonusType }, { bonusType: BONUS_TYPES.COUPON_CODE }],
              [Op.or]: [{ promoCode: promoCode }, { couponCode: promoCode }]
            }
          })
        if (bonus) return this.addError('PromoCodeBonusAlreadyExistErrorType')
      }
      if (bonusType === BONUS_TYPES.COUPON_CODE) {
        const bonus = await this.context.sequelize.models.bonus.findOne(
          {
            where: {
              [Op.or]: [{ bonusType: bonusType }, { bonusType: BONUS_TYPES.PROMOCODE }],
              [Op.or]: [{ couponCode: couponCode }, { promoCode: couponCode }]
            }
          })
        if (bonus) return this.addError('CouponCodeBonusAlreadyExistErrorType')
      }
      if (await this.context.sequelize.models.bonus.findOne({ where: { bonusType, 'promotionTitle.EN': promotionTitle.EN } })) return this.addError('ActiveBonusExistsErrorType')

      const bonusData = {
        validTo,
        isActive,
        bonusType,
        validFrom,
        validOnDays,
        daysToClear,
        wageringTemplateId,
        visibleInPromotions,
        tagIds: this.args.tagIds || [],
        description: await getLanguageWiseNameJson(description),
        promotionTitle: await getLanguageWiseNameJson(promotionTitle),
        termAndCondition: await getLanguageWiseNameJson(termAndCondition)
      }

      const bonus = await this.context.sequelize.models.bonus.create(bonusData, {
        transaction
      })
      if (bonusType === BONUS_TYPES.COUPON_CODE) {
        bonus.couponCode = couponCode
        if (percentage) bonus.metaData = { bonusPercentage: percentage }
        if (maxCouponClaims) bonus.maxCouponClaims = maxCouponClaims
        if (packageIds) bonus.packageIds = packageIds
      }
      if (bonusType === BONUS_TYPES.PROMOCODE) {
        if (promoCode) bonus.promoCode = promoCode
      }
      const result = await BONUS_SERVICE_MAP[bonusType]?.execute({ ...this.args, bonusId: bonus.id }, this.context)
      if (_.size(result?.errors)) return this.mergeErrors(result.errors)

      const currencyDetails = await Promise.all(this.args.currencyDetails.map(async (currency) => {
        if (await this.context.sequelize.models.currency.findOne({ where: { id: currency.currencyId } })) {
          currency.bonusId = bonus.id
          currency.metaData = { loosingAmount: currency?.loosingAmount, amount: currency?.amount, rakeBackAmount: currency.rakeBackAmount, bonusAmount: currency?.bonusAmount }
          return currency
        }
        return null
      }))

      if (_.includes(currencyDetails, null)) return this.addError('InvalidCurrencyDetailsErrorType')
      await this.context.sequelize.models.bonusCurrency.bulkCreate(currencyDetails, { transaction })

      if (bonusType === BONUS_TYPES.RAKEBACK) {
        const result = await RakeBackBonusService.execute({ bonus, currencyDetails }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)
      }

      if (bonusImage) {
        const fileLocation = await uploadFile(bonusImage.buffer, {
          name: bonus.id,
          mimetype: bonusImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.bonus
        })
        bonus.imageUrl = fileLocation
        await bonus.save({ transaction })
      }

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
