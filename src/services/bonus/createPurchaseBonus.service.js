
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    percentage: { type: 'number' },
    packageIds: { type: 'array' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          wageringAmount: {type: 'number'}
        },
        additionalProperties: false
      }
    }

  },
  required: ['bonusId', 'currencyDetails', 'packageIds']
})

export class CreatePurchaseBonusService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {

    const { bonusId, percentage, packageIds } = this.args
    try {
      const purchaseBonusModel = this.context.sequelize.models.purchaseBonus;
      const transaction = this.context.sequelizeTransaction;

      const existingBonus = await purchaseBonusModel.findOne({
        where: { bonusId }
      });
    
      // Check for conflicting packageIds in other bonuses
      const conflictWhere = {
        packageIds: { [Op.overlap]: packageIds }
      };
    
      // When updating, exclude the same bonusId from conflict check
      if (existingBonus) {
        conflictWhere.bonusId = { [Op.ne]: bonusId };
      }
    
      const conflictingBonus = await purchaseBonusModel.findOne({
        where: conflictWhere
      });

      if(conflictingBonus) return this.addError('PackagesAlreadyAddedInOtherBonus')

      const bonus = await this.context.sequelize.models.purchaseBonus.upsert({
        bonusId,
        percentage,
        packageIds
      }, { transaction })

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
