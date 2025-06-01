import { APIError } from '@src/errors/api.error'
import { populateCurrenciesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    code: { type: 'string', minLength: 2, maxLength: 5, pattern: '^[A-Z]*$' },
    name: { type: 'string', maxLength: 50, minLength: 3 },
    type: { enum: Object.values(CURRENCY_TYPES) },
    symbol: { type: 'string' },
    currencyId: { type: 'number' },
    exchangeRate: { type: 'string' }
  },
  required: ['currencyId']
})

export class UpdateCurrencyService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const code = this.args.code
    const type = this.args.type
    const symbol = this.args.symbol
    const currencyId = this.args.currencyId
    const exchangeRate = this.args.exchangeRate
    const transaction = this.context.sequelizeTransaction

    try {
      const currency = await this.context.sequelize.models.currency.findOne({ where: { id: currencyId }, transaction })
      if (!currency) return this.addError('CurrencyNotFoundErrorType')

      if (code) currency.code = code
      if (name) currency.name = name
      if (type) currency.type = type
      if (symbol) currency.symbol = symbol
      if (exchangeRate) currency.exchangeRate = exchangeRate

      await populateCurrenciesCache()
      await currency.save({ transaction })
      return { currency }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
