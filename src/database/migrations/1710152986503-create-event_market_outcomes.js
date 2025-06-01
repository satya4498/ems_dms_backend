module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'event_market_outcomes',
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
        providerId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'providerId',
          _modelAttribute: true,
          field: 'provider_id'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        eventMarketId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'eventMarketId',
          _modelAttribute: true,
          field: 'event_market_id',
          references: {
            model: {
              tableName: 'event_markets',
              table: 'event_markets',
              name: 'eventMarket',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          fieldName: 'price',
          _modelAttribute: true,
          field: 'price'
        },
        settlement: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: '0',
          values: ['0', '1', '2', '3', '4', '5', '6'],
          fieldName: 'settlement',
          _modelAttribute: true,
          field: 'settlement'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: '1',
          values: ['1', '0', '2'],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        line: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'line',
          _modelAttribute: true,
          field: 'line'
        },
        baseLine: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'baseLine',
          _modelAttribute: true,
          field: 'base_line'
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
    return queryInterface.dropTable('event_market_outcomes', {
      schema: 'public'
    })
  }
}
