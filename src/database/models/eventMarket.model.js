import { EVENT_MARKET_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class EventMarket extends ModelBase {
  static model = 'eventMarket'

  static table = 'event_markets'

  static options = {
    name: {
      singular: 'eventMarket',
      plural: 'eventMarkets'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['event_id', 'market_id']
  }]

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    marketId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    eventId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(EVENT_MARKET_STATUS)),
      allowNull: false,
      defaultValue: EVENT_MARKET_STATUS.OPEN
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
    EventMarket.belongsTo(models.event, { foreignKey: 'eventId' })
    EventMarket.belongsTo(models.market, { foreignKey: 'marketId' })
    EventMarket.hasMany(models.eventMarketOutcome, { foreignKey: 'eventMarketId', onDelete: 'cascade', as: 'outcomes' })
    super.associate()
  }
}
