import { OUTCOME_SETTLEMENT_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Bet extends ModelBase {
  static model = 'bet'

  static table = 'bets'

  static options = {
    name: {
      singular: 'bet',
      plural: 'bets'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    betslipId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    eventId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    eventMarketId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    eventMarketOutcomeId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    odds: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    settlementStatus: {
      type: DataTypes.ENUM(Object.values(OUTCOME_SETTLEMENT_STATUS)),
      allowNull: false
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
    Bet.belongsTo(models.event, { foreignKey: 'eventId' })
    Bet.belongsTo(models.betslip, { foreignKey: 'betslipId' })
    Bet.belongsTo(models.eventMarket, { foreignKey: 'eventMarketId' })
    Bet.belongsTo(models.eventMarketOutcome, { foreignKey: 'eventMarketOutcomeId' })
    super.associate()
  }
}
