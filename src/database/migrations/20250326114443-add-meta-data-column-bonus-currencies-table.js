'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'wageringTemplateId' to the existing table
    await queryInterface.addColumn('bonus_currencies', 'meta_data', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'metaData',
      _modelAttribute: true,
      field: 'meta_data'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('bonus_currencies', 'meta_data')
  }
}
