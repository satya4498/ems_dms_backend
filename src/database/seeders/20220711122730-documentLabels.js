'use strict'
const defaultDocumentLabels = [{
  name: 'Identity Proof'
}, {
  name: 'Proof of Address'
}, {
  name: 'Bank Statement'
}]

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('document_labels', defaultDocumentLabels.map(defaultDocumentLabel => {
    return {
      ...defaultDocumentLabel,
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
  await queryInterface.bulkDelete('document_labels')
}

export { up, down }
