module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'event_participants',
      {
        id: {
          allowNull: false,
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        eventId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'eventId',
          _modelAttribute: true,
          field: 'event_id',
          references: {
            model: {
              tableName: 'events',
              table: 'events',
              name: 'event',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        participantId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'participantId',
          _modelAttribute: true,
          field: 'participant_id',
          references: {
            model: {
              tableName: 'participants',
              table: 'participants',
              name: 'participant',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        position: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'position',
          _modelAttribute: true,
          field: 'position'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    )
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('event_participants', { schema: 'public' })
  }
}
