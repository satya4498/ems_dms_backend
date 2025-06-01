'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('bonus', 'coupon_code', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('bonus', 'max_coupon_claims', {
      type: DataTypes.BIGINT,
      allowNull: true
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('bonus', 'coupon_code')
    await queryInterface.removeColumn('bonus', 'max_coupon_claims')
  }
}
