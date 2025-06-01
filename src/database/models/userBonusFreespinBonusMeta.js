import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserBonusFreespinBonusMeta extends ModelBase {
  static model = 'userBonusFreespinBonusMeta'

  static table = 'user_bonus_freespin_bonus_meta'

  static options = {
    name: {
      singular: 'user_bonus_freespin_bonus_meta',
      plural: 'user_bonus_freespin_bonus_meta'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userBonusId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    remainingFreespins: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    betLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    allowedGames: {
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
    UserBonusFreespinBonusMeta.belongsTo(models.userBonus, { foreignKey: 'userBonusId' })
    super.associate()
  }
}
