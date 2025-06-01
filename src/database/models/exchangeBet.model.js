import { EXCHANGE_BET_TYPES, MATCHING_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ExchangeBet extends ModelBase {
  static model = 'exchangeBet'

  static table = 'exchange_bets'

  static options = {
    name: {
      singular: 'exchangeBet',
      plural: 'exchangeBets'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
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
    betType: {
      type: DataTypes.ENUM(Object.values(EXCHANGE_BET_TYPES)),
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    stake: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    winnings: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    winningsAfterCommission: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    slippage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    offeredOdds: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    odds: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    matchingStatus: {
      type: DataTypes.ENUM(Object.values(MATCHING_STATUS)),
      allowNull: false,
      defaultValue: MATCHING_STATUS.UNMATCHED
    },
    matchedLiability: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    unmatchedLiability: {
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
    ExchangeBet.belongsTo(models.user, { foreignKey: 'userId' })
    ExchangeBet.belongsTo(models.event, { foreignKey: 'eventId' })
    ExchangeBet.belongsTo(models.eventMarket, { foreignKey: 'eventMarketId' })
    ExchangeBet.belongsTo(models.eventMarketOutcome, { foreignKey: 'eventMarketOutcomeId' })
    super.associate()
  }
}
