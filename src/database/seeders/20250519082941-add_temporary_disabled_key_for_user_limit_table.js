import { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES, USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "users"',
      { type: Sequelize.QueryTypes.SELECT }
    )

    // Prepare seed data for each user
    const now = new Date()
    const rows = users.map(user => ({
      user_id: user.id,
      type: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.ENUM, // Use the correct type as per your logic
      key: USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.TEMPORARY_DISABLED,
      value: '',
      current_value: '',
      disabled_count: 0,
      expire_at: null,
      created_at: now,
      updated_at: now
    }))

    if (rows.length) {
      await queryInterface.bulkInsert('user_limits', rows)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'user_limits',
      { key: USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.TEMPORARY_DISABLED }
    )
  }
}
