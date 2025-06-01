'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_game_progress_meta_data', {
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
      metaData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'meta_data'
      },
      totalDeposit: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'total_deposit'
      },
      depositCount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'deposit_count'
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

    await queryInterface.addConstraint('user_game_progress_meta_data', {
      fields: ['user_id'],
      type: 'unique',
      name: 'unique_user_metadata'
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('user_game_progress_meta_data', 'unique_user_metadata')
    return queryInterface.dropTable('user_game_progress_meta_data', { schema: 'public' })
  }
}
