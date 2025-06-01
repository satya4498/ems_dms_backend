'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new values to the ENUM type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bonus_bonus_type" 
      ADD VALUE IF NOT EXISTS 'bass_boost'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
};
