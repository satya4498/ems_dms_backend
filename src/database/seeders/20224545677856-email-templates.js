'use strict'
import { defaultEmailTemplates } from './defaultEmailTemplates'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('email_templates', defaultEmailTemplates.map(defaultEmailTemplate => {
    return {
      ...defaultEmailTemplate,
      created_at: new Date(),
      updated_at: new Date()
    }
  }))
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('email_templates')
}

export { down, up }
