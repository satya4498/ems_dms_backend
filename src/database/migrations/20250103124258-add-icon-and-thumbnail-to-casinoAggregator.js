'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('casino_aggregators', 'desktop_thumbnail_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL for the aggregator icon',
    });

    await queryInterface.addColumn('casino_aggregators', 'mobile_thumbnail_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL for the aggregator mobile thumbnail',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('casino_aggregators', 'desktop_thumbnail_url');
    await queryInterface.removeColumn('casino_aggregators', 'mobile_thumbnail_url');
  },
};