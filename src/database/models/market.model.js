import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Market extends ModelBase {
  static model = 'market'

  static table = 'markets'

  static options = {
    name: {
      singular: 'market',
      plural: 'markets'
    }
  }

  static attributes = {
    id: {
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    Market.hasMany(models.eventMarket, { foreignKey: 'marketId', onDelete: 'cascade' })
    Market.belongsToMany(models.event, { foreignKey: 'eventId', through: models.eventMarket })
    super.associate()
  }
}
