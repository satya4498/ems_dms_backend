import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class LoyaltyLevel extends ModelBase {
  static model = 'loyaltyLevel'

  static table = 'loyalty_levels'

  static options = {
    name: {
      singular: 'loyalty_level',
      plural: 'loyalty_levels'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    levelDescription: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    loyaltyBonusAmount: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    levelUpPoints: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    daysToClear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    super.associate()
  }
}
