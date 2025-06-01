import { APIError } from '@src/errors/api.error'
import { populateCurrenciesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    code: { type: 'string', minLength: 3, maxLength: 10, pattern: '^[A-Z]*$' },
    name: { type: 'string', maxLength: 50, minLength: 3, pattern: '^[a-zA-Z0-9 ]*$' },
    type: { enum: Object.values(CURRENCY_TYPES) },
    exchangeRate: { type: 'number', default: 1 },
    isActive: { type: 'boolean', default: true },
    symbol: { type: 'string' }
  },
  required: ['code', 'type', 'name', 'symbol']
})

export class CreateCurrencyService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const type = this.args.type
    const isActive = this.args.isActive
    const code = this.args.code.toUpperCase()
    const exchangeRate = this.args.exchangeRate
    const symbol = this.args.symbol
    const transaction = this.context.sequelizeTransaction

    try {
      const orFilter = [{ code }]
      if (type && type === CURRENCY_TYPES.POINTS) orFilter.push({ type })
      const [currency, created] = await this.context.sequelize.models.currency.findOrCreate({
        defaults: { code, name, type, isActive, exchangeRate, symbol },
        where: { [Op.or]: orFilter },
        transaction
      })
      if (!created) return this.addError('CurrencyAlreadyExistsErrorType')

      const allUsers = await this.context.sequelize.models.user.findAll({ attributes: ['id'], raw: true, transaction })
      await this.context.sequelize.models.wallet.bulkCreate(allUsers.map(user => {
        return {
          userId: user.id,
          currencyId: currency.id
        }
      }), { transaction })

      await populateCurrenciesCache()
      return { currency }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
