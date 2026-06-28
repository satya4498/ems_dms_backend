'use strict';
import { BUSINESS_TYPES } from '@src/utils/constants/public.constants.utils'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'business_type', {
      type: Sequelize.ENUM(Object.values(BUSINESS_TYPES)),
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'business_type')
  }
};
