'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('bonus', 'meta_data', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'metaData',
      _modelAttribute: true,
      field: 'meta_data',
      defaultValue: {}
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('bonus', 'meta_data')
  }
}
