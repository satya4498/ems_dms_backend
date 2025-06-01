import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Spread extends ModelBase {
  static model = 'spread'

  static table = 'spreads'

  static options = {
    name: {
      singular: 'spread',
      plural: 'spreads'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    eventMarketOutcomeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    laySpread: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    backSpread: {
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
    Spread.belongsTo(models.eventMarketOutcome, { foreignKey: 'eventMarketOutcomeId' })
    super.associate()
  }
}
