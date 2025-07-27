'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('transactions', 'status', {
      type: DataTypes.ENUM('approved', 'rejected', 'pending'),
      allowNull: true,
      defaultValue: 'approved',
      after: 'reference' // place after reference if supported
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('transactions', 'status')
    // Drop the enum type (Postgres/Sequelize only)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_transactions_status";')
  }
}
