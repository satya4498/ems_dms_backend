module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'phone', {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'phone', {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    })
  }
}
