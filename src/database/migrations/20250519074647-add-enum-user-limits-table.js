'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    // Add a new value to the ENUM type for the "key" column in "user_limits"
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'temporary_disabled';
    `)

    // Add the disabled_count column
    await queryInterface.addColumn(
      'user_limits',
      'disabled_count',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the disabled_count column
    await queryInterface.removeColumn('user_limits', 'disabled_count')
    // No direct way to remove ENUM value in PostgreSQL, so left empty
  }
}
