module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'betslips',
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
        type: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ['single', 'multiple'],
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        stake: {
          type: DataTypes.FLOAT,
          allowNull: false,
          fieldName: 'stake',
          _modelAttribute: true,
          field: 'stake'
        },
        multipliedOdds: {
          type: DataTypes.FLOAT,
          allowNull: true,
          fieldName: 'multipliedOdds',
          _modelAttribute: true,
          field: 'multiplied_odds'
        },
        settlementStatus: {
          type: DataTypes.ENUM,
          defaultValue: 'pending',
          allowNull: false,
          values: [
            'won',
            'lost',
            'refund',
            'pending',
            'cashout',
            'half_won',
            'half_lost'
          ],
          fieldName: 'settlementStatus',
          _modelAttribute: true,
          field: 'settlement_status'
        },
        winningAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'winningAmount',
          _modelAttribute: true,
          field: 'winning_amount'
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
    return queryInterface.dropTable('betslips', { schema: 'public' })
  }
}
