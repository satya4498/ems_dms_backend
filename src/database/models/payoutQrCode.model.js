import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class PayoutQrCode extends ModelBase {
  static model = 'payoutQrCode'

  static table = 'payout_qr_codes'

  static options = {
    name: {
      singular: 'payoutQrCode',
      plural: 'payoutQrCodes'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Admin user id who created the QR code'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    this.belongsTo(models.user, { foreignKey: 'createdBy' })
    this.hasMany(models.payoutQrCodeRedemption, { foreignKey: 'qrCodeId' })
    super.associate()
  }
}
