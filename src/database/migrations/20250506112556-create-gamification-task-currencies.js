'use strict'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('gamification_task_currencies', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      currencyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'currency_id',
        references: {
          model: {
            tableName: 'currencies',
            schema: 'public'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM(Object.values(CURRENCY_TYPES)),
        allowNull: false,
        field: 'type',
        defaultValue: CURRENCY_TYPES.SWEEP_COIN
      },
      bonusAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: 'bonus_amount'
      },
      metaData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'meta_data',
        defaultValue: {}
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('gamification_task_currencies')
  }
}
