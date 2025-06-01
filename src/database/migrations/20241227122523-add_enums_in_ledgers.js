'use strict'

// this migration is useed to add new enums
// while 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new values to the ENUM type
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'CasinoWinRollback'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'CasinoBetRollback'`);
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
};
