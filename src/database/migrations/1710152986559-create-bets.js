module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'bets',
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
        betslipId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'betslipId',
          _modelAttribute: true,
          field: 'betslip_id',
          references: {
            model: {
              tableName: 'betslips',
              table: 'betslips',
              name: 'betslip',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
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
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
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
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        eventMarketOutcomeId: {
          type: DataTypes.BIGINT,
          allowNull: false,
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
        odds: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'odds',
          _modelAttribute: true,
          field: 'odds'
        },
        settlementStatus: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ['0', '1', '2', '3', '4', '5', '6'],
          fieldName: 'settlementStatus',
          _modelAttribute: true,
          field: 'settlement_status'
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
    return queryInterface.dropTable('bets', { schema: 'public' })
  }
}
