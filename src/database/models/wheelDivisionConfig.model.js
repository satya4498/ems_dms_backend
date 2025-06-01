import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class WheelDivisionConfiguration extends ModelBase {
  static model = 'wheelDivisionConfiguration'

  static table = 'wheel_division_configurations'

  static options = {
    name: {
      singular: 'wheel_division_configuration',
      plural: 'wheel_division_configurations'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    gc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    isAllow: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    playerLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bonusId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'bonus_id',
      references: {
        model: 'bonus',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }

  static associate (models) {
    WheelDivisionConfiguration.belongsTo(models.bonus, { foreignKey: 'bonusId', as: 'bonus' })
    super.associate()
  }
}
