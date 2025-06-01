import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class ChatGroup extends ModelBase {
  static model = 'chatGroup'

  static table = 'chat_groups'

  static options = {
    name: {
      singular: 'chat_group',
      plural: 'chat_groups'
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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    groupLogo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admins: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: false
    },
    criteria: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false
    }
  }

  static associate (models) {
    ChatGroup.hasMany(models.message, { foreignKey: 'chatGroupId', onDelete: 'cascade' })
    ChatGroup.hasMany(models.userChatGroup, { foreignKey: 'chatGroupId', onDelete: 'cascade' })
    super.associate()
  }

}
