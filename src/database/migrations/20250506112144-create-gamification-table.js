'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'gamification',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: 'id'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'name'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'description'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'image_url'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
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
    return queryInterface.dropTable('gamification', { schema: 'public' })
  }
}
