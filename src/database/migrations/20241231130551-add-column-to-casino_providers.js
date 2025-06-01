'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('casino_providers', 'mobile_thumbnail_url', {
      type: Sequelize.STRING,
      allowNull: true, // Set to true or false depending on your requirements
      defaultValue: '', // Set a default value if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('casino_providers', 'mobile_thumbnail_url');
  }
};
