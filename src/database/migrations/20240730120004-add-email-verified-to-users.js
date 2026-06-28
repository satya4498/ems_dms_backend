module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'email_verified', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email_verified')
  }
}
