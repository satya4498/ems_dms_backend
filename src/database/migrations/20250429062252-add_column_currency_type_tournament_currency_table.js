'use strict'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('tournament_currencies', 'type', {
      type: DataTypes.ENUM(...Object.values(CURRENCY_TYPES)),
      allowNull: false,
      defaultValue: CURRENCY_TYPES.SWEEP_COIN
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  async down (queryInterface) {
    await queryInterface.removeColumn('tournament_currencies', 'type')
  }
}
