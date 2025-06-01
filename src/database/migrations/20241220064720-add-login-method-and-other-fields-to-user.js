'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.addColumn('users', 'login_method', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'email', // Default to email login
    });

    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true, // Not required for all users, only for Google logins
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.removeColumn('users', 'login_method');
    await queryInterface.removeColumn('users', 'google_id');
  }
};
