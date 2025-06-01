module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'spreads',
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
        eventMarketOutcomeId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: true,
          fieldName: 'eventMarketOutcomeId',
          _modelAttribute: true,
          field: 'event_market_outcome_id',
          references: {
            model: {
              tableName: 'event_market_outcomes',
              table: 'event_market_outcomes',
              name: 'eventMarketOutcome',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        laySpread: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'laySpread',
          _modelAttribute: true,
          field: 'lay_spread'
        },
        backSpread: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'backSpread',
          _modelAttribute: true,
          field: 'back_spread'
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
    return queryInterface.dropTable('spreads', { schema: 'public' })
  }
}
