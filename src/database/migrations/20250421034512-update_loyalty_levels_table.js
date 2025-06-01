'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('loyalty_levels', 'coefficient', { transaction });
      await queryInterface.removeColumn('loyalty_levels', 'level_hold_points', { transaction });
      
      await queryInterface.addColumn('loyalty_levels', 'level_description', {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'level_description'
      }, { transaction });
      
      await queryInterface.addColumn('loyalty_levels', 'loyalty_bonus_amount', {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: 0,
        field: 'loyalty_bonus_amount'
      }, { transaction });

      await queryInterface.addColumn('loyalty_levels', 'icon_url', {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'icon_url'
      }, { transaction });

      await queryInterface.addColumn('loyalty_levels', 'days_to_clear', {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'days_to_clear'
      }, { transaction });

    });
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('loyalty_levels', 'coefficient', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: 'coefficient'
      }, { transaction });
      
      await queryInterface.addColumn('loyalty_levels', 'level_hold_points', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: 'level_hold_points'
      }, { transaction });
      
      await queryInterface.removeColumn('loyalty_levels', 'level_description', { transaction });
      await queryInterface.removeColumn('loyalty_levels', 'loyalty_bonus_amount', { transaction });
      await queryInterface.removeColumn('loyalty_levels', 'icon_url', { transaction });
      await queryInterface.removeColumn('loyalty_levels', 'days_to_clear', { transaction });

    });
  }
};
