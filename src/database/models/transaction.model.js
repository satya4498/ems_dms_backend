import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Transaction extends ModelBase {
  static model = 'transaction'

  static table = 'transactions'

  static options = {
    name: {
      singular: 'transaction',
      plural: 'transactions'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    walletId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'wallets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('credit', 'debit'),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('approved', 'rejected', 'pending'),
      allowNull: true
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
    this.belongsTo(models.wallet, { foreignKey: 'walletId' })
    this.hasOne(models.ledger, { foreignKey: 'transactionId' })
    super.associate()
  }
}
