'use strict'

// this migration is useed to add new enums
// while 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new values to the ENUM type
    await queryInterface.sequelize.query(`ALTER TYPE enum_user_bonus_status RENAME VALUE 'forfitted' TO 'forfeited'`);
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
};