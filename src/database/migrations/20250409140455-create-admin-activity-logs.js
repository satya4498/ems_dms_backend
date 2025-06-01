'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('admin_activity_logs', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fieldsAffected: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'fields_affected',
        defaultValue: {}
      },
      recordId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'record_id'
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'admin_id'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('admin_activity_logs', { schema: 'public' })
  }
}
