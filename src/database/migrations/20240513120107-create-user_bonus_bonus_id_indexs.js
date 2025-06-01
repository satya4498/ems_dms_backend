module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.user_bonus', {
        unique: true,
        fields: ['bonus_id', 'user_id'],
        type: '',
        parser: null,
        name: 'user_bonus_user_id_bonus_id'
      })
    ])
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await Promise.all([
      queryInterface.removeIndex(
        'public.user_bonus',
        'user_bonus_user_id_bonus_id'
      )
    ])
  }
}
