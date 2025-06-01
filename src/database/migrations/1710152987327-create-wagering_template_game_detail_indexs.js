module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.wagering_template_game_details', {
        unique: true,
        fields: ['casino_game_id', 'wagering_template_id'],
        type: '',
        parser: null,
        name: 'casino_games_wagering_template_id'
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
        'public.wagering_template_game_details',
        'casino_games_wagering_template_id'
      )
    ])
  }
}
