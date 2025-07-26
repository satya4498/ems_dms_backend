import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class PayoutQrCodeRedemption extends ModelBase {
  static model = 'payoutQrCodeRedemption'

  static table = 'payout_qr_code_redemptions'

  static options = {
    name: {
      singular: 'payoutQrCodeRedemption',
      plural: 'payoutQrCodeRedemptions'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    qrCodeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'payout_qr_codes',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'scanned'),
      allowNull: false,
      defaultValue: 'pending'
    },
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'Admin who approved/rejected the request'
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Admin remarks for approval/rejection'
    },
    redeemedAt: {
      type: DataTypes.DATE,
      allowNull: false
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
    this.belongsTo(models.payoutQrCode, { foreignKey: 'qrCodeId' })
    this.belongsTo(models.user, { foreignKey: 'userId' })
    this.belongsTo(models.user, { foreignKey: 'adminId', as: 'admin' })
    super.associate()
  }
}
