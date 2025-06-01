'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'two_factor_secret', {
      type: Sequelize.STRING,
      allowNull: true, // Allows null for users not using 2FA
      comment: 'Secret key for 2FA setup',
    });

    await queryInterface.addColumn('users', 'two_factor_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false // Default to false for existing users 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'two_factor_secret');
    await queryInterface.removeColumn('users', 'two_factor_enabled');
  }
};
