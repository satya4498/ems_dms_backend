module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique'
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'password')
    await queryInterface.removeConstraint('users', 'users_email_unique')
  }
}
