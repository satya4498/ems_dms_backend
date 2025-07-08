module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'fund_account_id', {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'RazorpayX fund account ID for payouts'
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('users', 'fund_account_id')
  }
}
