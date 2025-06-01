module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.addColumn(
      {
        tableName: 'user_bonus',
        schema: 'public'
      },
      'referred_to',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        fieldName: 'referredTo',
        _modelAttribute: true,
        field: 'referred_to'
      }
    )
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.removeColumn(
      {
        tableName: 'user_bonus',
        schema: 'public'
      },
      'referred_to'
    )
  }
}
