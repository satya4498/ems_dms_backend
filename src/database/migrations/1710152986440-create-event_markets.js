module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'event_markets',
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
          onUpdate: 'CASCADE',
          unique: 'event_markets_eventId_eventId_unique'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: '1',
          values: ['0', '1', '2'],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
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
        },
        marketId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: 'markets',
              table: 'markets',
              name: 'market',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          fieldName: 'marketId',
          _modelAttribute: true,
          field: 'market_id'
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
    return queryInterface.dropTable('event_markets', { schema: 'public' })
  }
}
