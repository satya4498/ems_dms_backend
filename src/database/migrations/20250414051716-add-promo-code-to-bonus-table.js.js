'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('bonus', 'promo_code', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'promoCode',
      _modelAttribute: true,
      field: 'promo_code'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('bonus', 'promo_code')
  }
}
