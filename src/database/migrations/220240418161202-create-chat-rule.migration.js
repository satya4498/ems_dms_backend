'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('chat_rules', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      rules:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdBy:{
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'created_by'
      },
      updatedBy:{
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'updated_by'
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
    await queryInterface.dropTable('chat_rules', { schema: 'public' })
  }
}
