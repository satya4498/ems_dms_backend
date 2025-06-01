import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES,USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE,LEDGER_TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'
import { SendJoiningBonusEmailService } from '@src/services/emailTemplates/sendJoiningBonusEmail.service'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    language: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['userId', 'email', 'username', 'adminUserId']
})

export class JoiningBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const email = this.args.email
      const username = this.args.username
      const language = this.args.language
      const adminUserId = this.args.adminUserId
      const purpose = LEDGER_PURPOSE.BONUS_CASHED
      const transaction = this.context.sequelizeTransaction
      const walletModel = this.context.sequelize.models.wallet

      const welcomeBonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'claimedCount'],
        where: {
          bonusType: BONUS_TYPES.JOINING,
          isActive: true
        },
        include: {
          model: this.context.models.bonusCurrency,
          include: {
            model: this.context.models.currency,
            where:  { code : { [Op.in]: ['GC', 'BSC'] }},
            required: true
          }
        },
        transaction
      })

      if (!welcomeBonus) return this.addError('InvalidBonusIdErrorType')
        
      const tx = await this.context.sequelize.models.transaction.create({
        userId,
        actioneeId: adminUserId,
        status: TRANSACTION_STATUS.COMPLETED
      }, { transaction })
      let amount
      for (const bonusCurrency of welcomeBonus.bonusCurrencies) {

         amount = bonusCurrency?.joiningAmount

        const wallet = await walletModel.findOne({
          where: { userId, currencyId: bonusCurrency.currencyId },
          include: {
            model: this.context.sequelize.models.currency,
            where: { code: bonusCurrency?.currency?.code }
          },
          transaction
        })

        if (!wallet) return this.addError('InvalidWalletIdErrorType')

        const result = await CreateLedgerService.execute({
          userId,
          amount,
          walletId: wallet.id,
          purpose,
          transactionId: tx.id,
          currencyId: wallet.currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.STANDARD,
        }, this.context)

        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        // tx.ledger = result.result

        await wallet.save({ transaction })
      }
      await this.context.sequelize.models.userBonus.create({
        bonusId: welcomeBonus.id,
        userId,
        transactionId: tx.id,
        status: USER_BONUS_STATUS_VALUES.CLAIMED,
        claimedAt: new Date()
      }, { transaction})

      await welcomeBonus.set({ claimedCount: welcomeBonus.claimedCount + 1 }).save({ transaction })

      const { result: emailSent } = await SendJoiningBonusEmailService.execute({
        email,
        username,
        language,
        amount
      }, this.context)

      return { emailSent }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
