import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { TRANSACTION_STATUS } from 'dist/src/utils/constants/payment.constants'
import { WITHDRAWAL_STATUS } from 'dist/src/utils/constants/public.constants.utils'
import { NumberPrecision } from 'dist/src/libs/numberPrecision'
import { ApprovelyAxios } from '@src/libs/axios/approvely.axios'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    status: { type: 'string' },
  },
  required: ['id', 'status']
})

export class UpdateRedeemStatusService extends ServiceBase {

  get constraints () {
    return constraints
  }

  async run () {
    const { id, status } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const withdrawalDetails = await this.context.sequelize.models.withdrawal.findOne({
        where: { id, status: WITHDRAWAL_STATUS.PENDING },
        transaction
      })
      if(!withdrawalDetails) return this.addError('NoPendingWithdrawalErrorType')

      const transactionDetails = await this.context.sequelize.models.transaction.findOne({
        where: { id: withdrawalDetails.transactionId },
        transaction
      })

      if (status === WITHDRAWAL_STATUS.REJECTED) {
        withdrawalDetails.status = WITHDRAWAL_STATUS.REJECTED
        transactionDetails.status = TRANSACTION_STATUS.FAILED
      } else {
        let data = {
          userId: withdrawalDetails.userId,
          amount: { cents: NumberPrecision.times(withdrawalDetails.amount, 100) },
          speed: "asap",
          account: withdrawalDetails.token,
        }

        let response = await ApprovelyAxios.withdrawTransaction(withdrawalDetails.userId, data)

        withdrawalDetails.status = WITHDRAWAL_STATUS.APPROVED
        transactionDetails.paymentId = response.signature
      }

      await withdrawalDetails.save({ transaction })
      await transactionDetails.save({ transaction })

      return withdrawalDetails
    } catch (error) {
      throw new APIError(error)
    }
  }
}