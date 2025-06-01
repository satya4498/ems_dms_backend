import { EVENT_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Event extends ModelBase {
  static model = 'event'

  static table = 'events'

  static options = {
    name: {
      singular: 'event',
      plural: 'events'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    fixtureId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(EVENT_STATUS)),
      allowNull: false,
      defaultValue: EVENT_STATUS.NOT_STARTED
    },
    bettingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    score: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    leagueId: {
      type: DataTypes.BIGINT,
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
    Event.belongsTo(models.league, { foreignKey: 'leagueId' })
    Event.hasMany(models.bet, { foreignKey: 'eventId', onDelete: 'cascade' })
    Event.hasMany(models.eventMarket, { foreignKey: 'eventId', onDelete: 'cascade' })
    Event.hasMany(models.exchangeBet, { foreignKey: 'eventId', onDelete: 'cascade' })
    Event.hasMany(models.eventParticipant, { foreignKey: 'eventId', onDelete: 'cascade' })
    Event.belongsToMany(models.market, { foreignKey: 'eventId', through: models.eventMarket })
    super.associate()
  }
}
