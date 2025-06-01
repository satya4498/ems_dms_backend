'use strict'
const defaultLanguages = [{
  code: 'EN',
  name: 'English'
}, {
  code: 'FR',
  name: 'French'
}, {
  code: 'ES',
  name: 'Spanish'
}]

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('languages', defaultLanguages.map(defaultLanguage => {
    return {
      ...defaultLanguage,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  }))
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('languages')
}

export { down, up }
