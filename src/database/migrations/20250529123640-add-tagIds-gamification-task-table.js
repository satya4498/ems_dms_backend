'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('gamification_tasks', 'tag_ids', {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
      allowNull: true,
      defaultValue: []
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('gamification_tasks', 'tag_ids')
  }
}
