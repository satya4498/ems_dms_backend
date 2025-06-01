import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Gamification extends ModelBase {
  static model = 'gamification'

  static table = 'gamification'

  static options = {
    name: {
      singular: 'gamification',
      plural: 'gamifications'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }

  static associate (models) {
    Gamification.hasMany(models.gamificationTask, {
      foreignKey: 'gamificationId',
      as: 'tasks',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    super.associate()
  }
}
