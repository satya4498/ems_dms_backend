'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('casino_providers', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Specifies the display order of providers',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('casino_providers', 'order_id');
  }
};
