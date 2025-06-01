import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ThreadAttachement extends ModelBase {
  static model = 'threadAttachement'

  static table = 'thread_attachements'

  static options = {
    name: {
      singular: 'thread_attachement',
      plural: 'thread_attachements'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    messageId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
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
    ThreadAttachement.belongsTo(models.user, { foreignKey: 'messageId' })
    super.associate()
  }
}
