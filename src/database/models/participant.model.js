import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Participant extends ModelBase {
  static model = 'participant'

  static table = 'participants'

  static options = {
    name: {
      singular: 'participant',
      plural: 'participants'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (models) {
    Participant.hasMany(models.eventParticipant, { foreignKey: 'participantId', onDelete: 'cascade' })
    super.associate()
  }
}
