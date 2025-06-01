'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('banners', 'redirection_url', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'redirectionUrl',
      _modelAttribute: true,
      field: 'redirection_url'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('banners', 'redirection_url')
  }
}