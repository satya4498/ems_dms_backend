import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitUserWallet } from '@src/socket-resources/emitters/wallet.emitter'
import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    walletId: { type: 'number' },
    currencyId: { type: 'string' },
    transactionType: { enum: Object.values(LEDGER_TRANSACTION_TYPE) },
    transactionId: { type: 'string' }
  },
  required: ['userId', 'walletId', 'purpose', 'amount', 'currencyId']
})

export class CreateLedgerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, purpose, amount, walletId, currencyId, transactionType, transactionId } = this.args
    const type = LEDGER_RULES[purpose]
    const transaction = this.context.sequelizeTransaction
    const WalletModel = this.context.sequelize.models.wallet
    const LedgerModel = this.context.sequelize.models.ledger
    try {
      const wallet = await WalletModel.findOne({ where: { id: walletId, userId }, lock: true, transaction })
      if (!wallet) throw new APIError('WalletNotFoundError')

      if (type === LEDGER_TYPES.CREDIT) {
        wallet.amount = NumberPrecision.plus(wallet.amount, amount)
      } else if (wallet.amount < amount) {
        return this.addError('NotEnoughAmountErrorType')
      } else {
        wallet.amount = NumberPrecision.minus(wallet.amount, amount)
      }

      const ledgerData = {
        purpose,
        amount,
        currencyId,
        transactionType,
        transactionId,
        [type === LEDGER_TYPES.CREDIT ? 'toWalletId' : 'fromWalletId']: wallet.id
      }
      await LedgerModel.create(ledgerData, { transaction })
      await wallet.save({ transaction })

      emitUserWallet(userId, wallet)
      return ledgerData
    } catch (error) {
      throw new APIError(error.message || 'InternalServerError')
    }
  }
}
