import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { WAGERING_TYPES } from '@src/utils/constants/bonus.constants.utils'

export default class WageringTemplate extends ModelBase {
  static model = 'wageringTemplate'

  static table = 'wagering_templates'

  static options = {
    name: {
      singular: 'wagering_template',
      plural: 'wagering_templates'
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
      allowNull: false,
      unique: true
    },
    wageringRequirementType: {
      type: DataTypes.ENUM(Object.values(WAGERING_TYPES)),
      allowNull: false
    },
    wageringMultiplier: {
      type: DataTypes.DOUBLE,
      defaultValue: 1.0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    WageringTemplate.hasMany(models.wageringTemplateGameDetail, { foreignKey: 'wageringTemplateId' })
    super.associate()
  }
}
