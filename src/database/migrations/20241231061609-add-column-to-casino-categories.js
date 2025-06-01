'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('casino_categories', 'mobile_thumbnail_url', {
      type: Sequelize.STRING,
      allowNull: true, 
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('casino_categories', 'mobile_thumbnail_url');
  },
};
