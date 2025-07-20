import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const updatePayoutConstraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    code: { type: 'string', minLength: 1 },
    amount: { type: 'number', minimum: 1 },
    createdBy: { type: 'number' }
  },
  required: ['id', 'code', 'amount', 'createdBy']
})

export class UpdatePayoutService extends ServiceBase {
  get constraints () {
    return updatePayoutConstraints
  }

  async run () {
    try {
      const { id, code, amount, createdBy } = this.args

      // Check if admin exists and has admin role
      const admin = await this.context.sequelize.models.user.findOne({
        where: { id: createdBy, role: 'admin' }
      })
      if (!admin) {
        return this.addError('AdminUserNotFoundErrorType', 'Admin not found or insufficient permissions')
      }

      // Check if QR code exists
      const qrCode = await this.context.sequelize.models.payoutQrCode.findByPk(id)
      if (!qrCode) {
        return this.addError('QrCodeNotFoundErrorType', 'QR code not found')
      }

      // Check if new code already exists (excluding current QR code)
      if (code !== qrCode.code) {
        const existingCode = await this.context.sequelize.models.payoutQrCode.findOne({
          where: { code, id: { [this.context.sequelize.Sequelize.Op.ne]: id } }
        })
        if (existingCode) {
          return this.addError('CodeAlreadyExistsErrorType', 'QR code with this code already exists')
        }
      }

      // Update QR code
      await qrCode.update({ code, amount })

      // Fetch updated QR code with creator info
      const updatedQrCode = await this.context.sequelize.models.payoutQrCode.findOne({
        where: { id },
        include: [
          {
            model: this.context.sequelize.models.user,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      })

      this.log.info('QR Code Updated', {
        message: 'QR code updated successfully',
        context: { qrCodeId: id, adminId: createdBy, newCode: code, newAmount: amount }
      })

      return {
        qrCode: updatedQrCode,
        message: 'QR code updated successfully'
      }
    } catch (err) {
      this.log.error('QR Code Update Failed', {
        message: err.message,
        context: { qrCodeId: this.args.id, adminId: this.args.createdBy },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
