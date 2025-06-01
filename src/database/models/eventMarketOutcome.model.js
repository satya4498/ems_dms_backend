import { OUTCOME_SETTLEMENT_STATUS, OUTCOME_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class EventMarketOutcome extends ModelBase {
  static model = 'eventMarketOutcome'

  static table = 'event_market_outcomes'

  static options = {
    name: {
      singular: 'eventMarketOutcome',
      plural: 'eventMarketOutcomes'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventMarketId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    settlement: {
      type: DataTypes.ENUM(Object.values(OUTCOME_SETTLEMENT_STATUS)),
      allowNull: false,
      defaultValue: OUTCOME_SETTLEMENT_STATUS.PENDING
    },
    status: {
      type: DataTypes.ENUM(Object.values(OUTCOME_STATUS)),
      allowNull: false,
      defaultValue: OUTCOME_STATUS.OPEN
    },
    line: {
      type: DataTypes.STRING,
      allowNull: true
    },
    baseLine: {
      type: DataTypes.STRING,
      allowNull: true
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
    EventMarketOutcome.belongsTo(models.eventMarket, { foreignKey: 'eventMarketId' })
    EventMarketOutcome.hasMany(models.bet, { foreignKey: 'eventMarketOutcomeId', onDelete: 'cascade' })
    EventMarketOutcome.hasMany(models.spread, { foreignKey: 'eventMarketOutcomeId', onDelete: 'cascade' })
    EventMarketOutcome.hasMany(models.exchangeBet, { foreignKey: 'eventMarketOutcomeId', onDelete: 'cascade' })
    super.associate()
  }
}
