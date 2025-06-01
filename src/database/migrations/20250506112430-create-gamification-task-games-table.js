'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('gamification_task_games', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      taskId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'task_id',
        references: {
          model: {
            tableName: 'gamification_tasks',
            schema: 'public'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      gameId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'game_id',
        references: {
          model: {
            tableName: 'casino_games',
            schema: 'public'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      minBetAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'min_bet_amount'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW
      }
    }, {
      schema: 'public'
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return queryInterface.dropTable('gamification_task_games', { schema: 'public' })
  }
}
