module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.event_markets', {
        unique: true,
        fields: ['event_id', 'market_id'],
        type: '',
        parser: null,
        name: 'event_markets_event_id_market_id'
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
        'public.event_markets',
        'event_markets_event_id_market_id'
      )
    ])
  }
}
