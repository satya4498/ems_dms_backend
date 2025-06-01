'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'wageringTemplateId' to the existing table
    await queryInterface.addColumn('user_bonus', 'currency_id', {
      type: DataTypes.BIGINT,
      allowNull: true,
      fieldName: 'wageringTemplateId',
      _modelAttribute: true,
      field: 'wagering_template_id',
      references: {
        model: {
          tableName: 'wagering_templates',
          table: 'wagering_templates',
          name: 'wageringTemplate',
          schema: 'public',
          delimiter: '.'
        },
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, DataTypes) {
    // Remove the added column 'wageringTemplateId' from the table during rollback
    await queryInterface.removeColumn('user_bonus', 'currency_id')
  }
}
