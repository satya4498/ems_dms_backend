import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ThreadMessage extends ModelBase {
  static model = 'threadMessage'

  static table = 'thread_messages'

  static options = {
    name: {
      singular: 'thread_message',
      plural: 'thread_messages'
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
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    threadId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    adminRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    ThreadMessage.hasMany(models.threadAttachement, { foreignKey: 'messageId', onDelete: 'cascase' })
    ThreadMessage.belongsTo(models.user, { foreignKey: 'userId' })
    ThreadMessage.belongsTo(models.adminUser, { foreignKey: 'adminId' })
    ThreadMessage.belongsTo(models.mainThread, { foreignKey: 'threadId' })
    super.associate()
  }
}
