'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'wageringAmount' to the existing table
    await queryInterface.addColumn('bonus_currencies', 'wagering_amount', {
      type: DataTypes.DOUBLE,
      allowNull: true,
      fieldName: 'wageringAmount',
      _modelAttribute: true,
      field: 'wagering_amount',
    })
  },

  async down (queryInterface, DataTypes) {
    // Remove the added column 'wageringAmount' from the table during rollback
    await queryInterface.removeColumn('bonus_currencies', 'wagering_amount')
  }
}