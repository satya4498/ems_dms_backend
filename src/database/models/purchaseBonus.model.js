import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class PurchaseBonus extends ModelBase {
  static model = 'purchaseBonus'

  static table = 'purchase_bonus'

  static options = {
    name: {
      singular: 'purchase_bonus',
      plural: 'purchase_bonus'
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
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    packageIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
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
    PurchaseBonus.belongsTo(models.bonus, { foreignKey: 'bonusId' })
    super.associate()
  }
}
