import { APIError } from '@src/errors/api.error'
import { populateCurrenciesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' }
  },
  required: ['currencyId']
})

export class SetDefaultCurrenciesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currencyId = this.args.currencyId
    const transaction = this.context.sequelizeTransaction

    try {
      const currency = await this.context.sequelize.models.currency.findOne({ where: { id: currencyId }, transaction })
      if (!currency) return this.addError('CurrencyNotFoundErrorType')

      currency.isDefault = true
      await currency.save({ transaction })
      await this.context.sequelize.models.currency.update({
        isDefault: false
      }, {
        where: { id: { [Op.ne]: currency.id } },
        transaction
      })

      await populateCurrenciesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
