import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Location extends ModelBase {
  static model = 'location'

  static table = 'locations'

  static options = {
    name: {
      singular: 'location',
      plural: 'locations'
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
    Location.hasMany(models.league, { foreignKey: 'locationId', onDelete: 'cascade' })
    super.associate()
  }
}
