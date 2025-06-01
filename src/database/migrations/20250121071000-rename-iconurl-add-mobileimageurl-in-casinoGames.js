'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('casino_games', 'icon_url', 'desktop_image_url');
    await queryInterface.addColumn('casino_games', 'mobile_image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('casino_games', 'desktop_image_url', 'icon_url');
    await queryInterface.removeColumn('casino_games', 'mobile_image_url');
  }
};
