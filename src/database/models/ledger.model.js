import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Ledger extends ModelBase {
  static model = 'ledger'

  static table = 'ledgers'

  static options = {
    name: {
      singular: 'ledger',
      plural: 'ledgers'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    walletId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'wallets',
        key: 'id'
      }
    },
    balanceBefore: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    balanceAfter: {
      type: DataTypes.FLOAT,
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
    this.belongsTo(models.transaction, { foreignKey: 'transactionId' })
    this.belongsTo(models.wallet, { foreignKey: 'walletId' })
    super.associate()
  }
}
