'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('currencies', [
      {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        is_active: true, // use snake_case here
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('currencies', { code: 'INR' })
  }
}
