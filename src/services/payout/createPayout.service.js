import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const payload = ajv.compile({
  type: 'object',
  properties: {
    code: { type: 'string', minLength: 1 },
    amount: { type: 'number', minimum: 1 },
    createdBy: { type: 'number' }
  },
  required: ['code', 'amount', 'createdBy']
})

export class CreatePayoutService extends ServiceBase {
  get constraints () {
    return payload
  }

  async run () {
    const { code, amount, createdBy } = this.args
    // Check for duplicate code
    const exists = await this.context.models.payoutQrCode.findOne({ where: { code } })
    if (exists) {
      return this.addError('CodeAlreadyExistsErrorType', 'QR code with this code already exists')
    }
    // Create payout QR code
    const payout = await this.context.models.payoutQrCode.create({ code, amount, createdBy })
    return payout
  }
}
