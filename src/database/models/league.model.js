import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class League extends ModelBase {
  static model = 'league'

  static table = 'leagues'

  static options = {
    name: {
      singular: 'league',
      plural: 'leagues'
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
    sportId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    locationId: {
      type: DataTypes.BIGINT,
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
    League.belongsTo(models.sport, { foreignKey: 'sportId' })
    League.belongsTo(models.location, { foreignKey: 'locationId' })
    League.hasMany(models.event, { foreignKey: 'leagueId', onDelete: 'cascade' })
    super.associate()
  }
}
