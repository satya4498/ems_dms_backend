'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  async up (queryInterface, DataTypes) {
    // Add unique constraint to coupon_code
    await queryInterface.changeColumn('bonus', 'coupon_code', {
      type: DataTypes.STRING,
      allowNull: true, // Ensure it matches the current schema
      unique: true
    })

    // Add unique constraint to promo_code
    await queryInterface.changeColumn('bonus', 'promo_code', {
      type: DataTypes.STRING,
      allowNull: true, // Ensure it matches the current schema
      unique: true
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  async down (queryInterface, DataTypes) {
    // Remove unique constraint from coupon_code
    await queryInterface.changeColumn('bonus', 'coupon_code', {
      type: DataTypes.STRING,
      allowNull: true, // Revert to the original schema
      unique: false
    })

    // Remove unique constraint from promo_code
    await queryInterface.changeColumn('bonus', 'promo_code', {
      type: DataTypes.STRING,
      allowNull: true, // Revert to the original schema
      unique: false
    })
  }
}
