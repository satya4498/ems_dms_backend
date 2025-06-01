'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'wageringTemplateId' to the existing table
    await queryInterface.addColumn('users', 'kyc_reject_description', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('documents', 'kyc_reject_description')
  }
}