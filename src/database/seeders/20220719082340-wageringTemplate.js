'use strict'

import { WAGERING_TYPES } from '@src/utils/constants/bonus.constants.utils'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('wagering_templates', [{
    name: 'Proceed Without Template',
    wagering_requirement_type: WAGERING_TYPES.BONUS_PLUS_CASH,
    created_at: new Date(),
    updated_at: new Date()
  }])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('wagering_templates')
}

export { down, up }
