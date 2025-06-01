import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class MainThread extends ModelBase {
  static model = 'mainThread'

  static table = 'main_threads'

  static options = {
    name: {
      singular: 'main_thread',
      plural: 'main_threads'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(QUERY_STATUS)),
      defaultValue: QUERY_STATUS.PENDING
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
    MainThread.hasMany(models.threadMessage, { foreignKey: 'threadId', onDelete: 'cascade' })
    MainThread.belongsTo(models.user, { foreignKey: 'userId' })
    super.associate()
  }
}
