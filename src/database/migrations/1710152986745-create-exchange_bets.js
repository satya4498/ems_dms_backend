module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'exchange_bets',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
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
          onDelete: 'cascade',
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
        betType: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ['lay', 'back'],
          fieldName: 'betType',
          _modelAttribute: true,
          field: 'bet_type'
        },
        profit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'profit',
          _modelAttribute: true,
          field: 'profit'
        },
        stake: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'stake',
          _modelAttribute: true,
          field: 'stake'
        },
        winnings: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'winnings',
          _modelAttribute: true,
          field: 'winnings'
        },
        winningsAfterCommission: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'winningsAfterCommission',
          _modelAttribute: true,
          field: 'winnings_after_commission'
        },
        slippage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'slippage',
          _modelAttribute: true,
          field: 'slippage'
        },
        offeredOdds: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'offeredOdds',
          _modelAttribute: true,
          field: 'offered_odds'
        },
        odds: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'odds',
          _modelAttribute: true,
          field: 'odds'
        },
        matchingStatus: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'unmatched',
          values: ['unmatched', 'fully_matched', 'partially_matched'],
          fieldName: 'matchingStatus',
          _modelAttribute: true,
          field: 'matching_status'
        },
        matchedLiability: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'matchedLiability',
          _modelAttribute: true,
          field: 'matched_liability'
        },
        unmatchedLiability: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'unmatchedLiability',
          _modelAttribute: true,
          field: 'unmatched_liability'
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
        walletId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: 'wallets',
              table: 'wallets',
              name: 'wallet',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE',
          fieldName: 'walletId',
          _modelAttribute: true,
          field: 'wallet_id'
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
    return queryInterface.dropTable('exchange_bets', { schema: 'public' })
  }
}
