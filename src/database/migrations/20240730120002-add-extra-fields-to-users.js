module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'fund_account_id', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('users', 'description', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'fund_account_id')
    await queryInterface.removeColumn('users', 'description')
  }
}
