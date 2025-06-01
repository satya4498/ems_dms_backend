import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Sport extends ModelBase {
  static model = 'sport'

  static table = 'sports'

  static options = {
    name: {
      singular: 'sport',
      plural: 'sports'
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    Sport.hasMany(models.league, { foreignKey: 'sportId', onDelete: 'cascade' })
    super.associate()
  }
}
