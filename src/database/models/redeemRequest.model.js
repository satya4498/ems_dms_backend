import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class RedeemRequest extends ModelBase {
  static model = 'redeemRequest'
  static table = 'redeem_requests'
  static options = {
    name: { singular: 'redeemRequest', plural: 'redeemRequests' }
  }

  static attributes = {
    id: { autoIncrement: true, type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'users', key: 'id' } },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
    requestedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    processedAt: { type: DataTypes.DATE, allowNull: true },
    adminId: { type: DataTypes.BIGINT, allowNull: true, references: { model: 'users', key: 'id' } },
    remarks: { type: DataTypes.STRING, allowNull: true }
  }

  static associate (models) {
    this.belongsTo(models.user, { foreignKey: 'userId' })
    this.belongsTo(models.user, { foreignKey: 'adminId', as: 'admin' })
    super.associate()
  }
}
