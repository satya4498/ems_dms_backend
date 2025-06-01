'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'bonus', // Table name
      'package_ids', // Column name
      {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers
        allowNull: true, // Allow null values
        defaultValue: [], // Default to an empty array
        comment: 'Array of package IDs for filtering'
      }
    )
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface) => {
    await queryInterface.removeColumn('bonus', 'package_id') // Remove the column
  }
}
