import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class EventParticipant extends ModelBase {
  static model = 'eventParticipant'

  static table = 'event_participants'

  static options = {
    name: {
      singular: 'eventParticipant',
      plural: 'eventParticipants'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['event_id', 'participant_id']
  }]

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    participantId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
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
    EventParticipant.belongsTo(models.event, { foreignKey: 'eventId' })
    EventParticipant.belongsTo(models.participant, { foreignKey: 'participantId' })
    super.associate()
  }
}
