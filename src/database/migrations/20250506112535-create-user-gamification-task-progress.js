'use strict'

module.exports = {
  /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_gamification_task_progress', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
        allowNull: true,
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
      amountWagered: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'amount_wagered',
        defaultValue: 0
      },
      amountToWager: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'amount_to_wager',
        defaultValue: 0
      },
      depositAmountRequired: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'deposit_amount_required',
        defaultValue: 0
      },
      depositAmountAchieved: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'deposit_amount_achieved',
        defaultValue: 0
      },
      depositCountRequired: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'deposit_count_required',
        defaultValue: 0
      },
      depositCountAchieved: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'deposit_count_achieved',
        defaultValue: 0
      },
      betCountRequired: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'bet_count_required',
        defaultValue: 0
      },
      betCountAchieved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'bet_count_achieved',
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'claimed'),
        allowNull: false,
        defaultValue: 'in_progress'
      },
      currencyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'currency_id'
      },
      gameCountRequired: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'game_count_required',
        defaultValue: 0
      },
      gameCountAchieved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'game_count_achieved',
        defaultValue: 0
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

  down: async (queryInterface) => {
    return queryInterface.dropTable('user_gamification_task_progress', { schema: 'public' })
  }
}
