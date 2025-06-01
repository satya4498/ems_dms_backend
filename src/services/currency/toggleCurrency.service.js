import { APIError } from '@src/errors/api.error'
import { populateCurrenciesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' }
  },
  required: ['currencyId']
})

export class ToggleCurrencyService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currencyId = this.args.currencyId

    try {
      const currency = await this.context.sequelize.models.currency.findOne({ where: { id: currencyId } })
      if (!currency) return this.addError('CurrencyNotFoundErrorType')
      if (currency.isDefault) return this.addError('CannotDeactivateDefaultCurrencyErrorType')

      currency.isActive = !currency.isActive
      await currency.save()

      await populateCurrenciesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
