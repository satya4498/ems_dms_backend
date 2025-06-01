'use strict';

const { USER_BONUS_STATUS_VALUES } = require('@src/utils/constants/bonus.constants.utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'loyalty_level_user',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: 'id'
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
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        loyaltyLevelId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'loyalty_level_id',
          references: {
            model: {
              tableName: 'loyalty_levels',
              schema: 'public'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        transactionId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          unique: true,
          fieldName: 'transactionId',
          _modelAttribute: true,
          field: 'transaction_id'
        },
        cashAmount: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'cashAmount',
          _modelAttribute: true,
          field: 'cash_amount'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: USER_BONUS_STATUS_VALUES.PENDING,
          values: Object.values(USER_BONUS_STATUS_VALUES),
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        claimedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'claimedAt',
          _modelAttribute: true,
          field: 'claimed_at'
        },
        expireAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'expireAt',
          _modelAttribute: true,
          field: 'expire_at'
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
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    );
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} _
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('loyalty_level_user', { schema: 'public' });
  }
};
