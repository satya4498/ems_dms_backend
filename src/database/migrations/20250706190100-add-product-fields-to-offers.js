'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Add price column
    await queryInterface.addColumn('offers', 'price', {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: 'Price in cents'
    })

    // Add product_name column
    await queryInterface.addColumn('offers', 'product_name', {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Product name'
    })

    // Add product_category column
    await queryInterface.addColumn('offers', 'product_category', {
      type: DataTypes.ENUM('Royal', 'Ultima', 'Regular'),
      allowNull: true,
      comment: 'Product category'
    })
  },

  down: async (queryInterface, DataTypes) => {
    // Remove columns in reverse order
    await queryInterface.removeColumn('offers', 'product_category')
    await queryInterface.removeColumn('offers', 'product_name')
    await queryInterface.removeColumn('offers', 'price')

    // Drop the enum type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_offers_product_category";')
  }
}
