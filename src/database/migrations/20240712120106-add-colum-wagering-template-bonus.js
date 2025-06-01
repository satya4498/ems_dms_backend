'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'wageringTemplateId' to the existing table
    await queryInterface.addColumn('bonus', 'wagering_template_id', {
      type: DataTypes.BIGINT,
      allowNull: true,
      fieldName: 'currencyId',
      _modelAttribute: true,
      field: 'currency_id',
      references: {
        model: {
          tableName: 'currencies',
          table: 'currencies',
          name: 'currency',
          schema: 'public',
          delimiter: '.'
        },
        key: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, DataTypes) {
    // Remove the added column 'wageringTemplateId' from the table during rollback
    await queryInterface.removeColumn('bonus', 'wagering_template_id')
  }
}
