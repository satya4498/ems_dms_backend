module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.event_participants', {
        unique: true,
        fields: ['event_id', 'participant_id'],
        type: '',
        parser: null,
        name: 'event_participants_event_id_participant_id'
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
        'public.event_participants',
        'event_participants_event_id_participant_id'
      )
    ])
  }
}
