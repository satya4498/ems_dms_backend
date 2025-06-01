'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('casino_games', 'min_bet', {
      type: DataTypes.DOUBLE,
      allowNull: true, // Set to true or false depending on your requirements
    });
    await queryInterface.addColumn('casino_games', 'max_bet', {
        type: DataTypes.DOUBLE,
        allowNull: true, // Set to true or false depending on your requirements
    });
    await queryInterface.addColumn('casino_games', 'more_details', {
        type: DataTypes.JSONB,
        allowNull: true, // Set to true or false depending on your requirements
        defaultValue: {}
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('casino_games', 'max_bet');
    await queryInterface.removeColumn('casino_games', 'min_bet');
    await queryInterface.removeColumn('casino_games', 'more_details');
  }
};
