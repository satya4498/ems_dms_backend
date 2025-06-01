'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user_bonus', ['user_id', 'bonus_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addIndex('user_bonus', ['user_id', 'bonus_id'], {
      unique: true
    });
  }
};
