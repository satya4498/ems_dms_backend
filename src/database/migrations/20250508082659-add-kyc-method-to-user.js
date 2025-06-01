'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'kyc_method', {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'kyc_method'
    });
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('users', 'kyc_method');
  }
};
