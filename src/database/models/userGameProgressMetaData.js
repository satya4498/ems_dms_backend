import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserGameProgressMetaData extends ModelBase {
  static model = 'userGameProgressMetaData'

  static table = 'user_game_progress_meta_data'

  static options = {
    name: {
      singular: 'userGameProgressMetaData',
      plural: 'userGameProgressMetaData'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    metaData: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    totalDeposit: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    depositCount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }

  static associate (models) {
    UserGameProgressMetaData.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })

    super.associate()
  }
}
