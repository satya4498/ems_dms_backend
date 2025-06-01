'use strict'

// this migration is useed to add new enums
// while 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new values to the ENUM type
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'BonusZeroedout'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'BonusLapsed'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'BonusCashed'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'BonusDeposit'`);
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
};
