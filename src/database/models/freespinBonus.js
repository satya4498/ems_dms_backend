import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class FreespinBonus extends ModelBase {
  static model = 'freespinBonus'

  static table = 'freespin_bonus'

  static options = {
    name: {
      singular: 'freespin_bonus',
      plural: 'freespin_bonus'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    bonusId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    freespinQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gameIds: {
      type: DataTypes.JSONB,
      allowNull: true
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
    FreespinBonus.belongsTo(models.bonus, { foreignKey: 'bonusId' })
    super.associate()
  }
}
