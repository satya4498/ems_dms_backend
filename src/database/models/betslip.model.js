import { BET_SLIP_SETTLEMENT_STATUS, BET_SLIP_TYPES } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Betslip extends ModelBase {
  static model = 'betslip'

  static table = 'betslips'

  static options = {
    name: {
      singular: 'betslip',
      plural: 'betslips'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(Object.values(BET_SLIP_TYPES)),
      allowNull: false
    },
    stake: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    walletId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    multipliedOdds: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    settlementStatus: {
      type: DataTypes.ENUM(Object.values(BET_SLIP_SETTLEMENT_STATUS)),
      defaultValue: BET_SLIP_SETTLEMENT_STATUS.PENDING,
      allowNull: false
    },
    winningAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (models) {
    Betslip.hasMany(models.sportsbookTransaction, { foreignKey: 'betId', onDelete: 'cascade' })
    Betslip.hasMany(models.bet, { foreignKey: 'betslipId', onDelete: 'cascade' })
    Betslip.belongsTo(models.user, { foreignKey: 'userId' })
    Betslip.belongsTo(models.wallet, { foreignKey: 'walletId' })
    super.associate()
  }
}
