import dayjs from 'dayjs'
import { v4 as UUID } from 'uuid'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, Sequelize) => {
    try {
      const existingBonus = await queryInterface.rawSelect(
        'bonus',
        { where: { bonus_type: 'referral' } },
        ['id']
      )

      if (existingBonus) {
        console.warn('Referral bonus already exists. Skipping seeder.')
        return
      }

      const currencyId = await queryInterface.rawSelect(
        'currencies',
        { where: { code: 'BSC' } },
        ['id']
      )

      if (!currencyId) {
        console.warn("Currency ID for 'BSC' not found. Skipping seeder.")
        return
      }

      const referralBonus = {
        code: UUID(),
        bonus_type: 'referral',
        description: JSON.stringify({
          DE: '<p>Referral Bonus</p>\r\n',
          DU: '<p>Referral Bonus</p>\r\n',
          EN: '<p>Referral Bonus</p>\r\n',
          ES: '<p>Referral Bonus</p>\r\n',
          FI: '<p>Referral Bonus</p>\r\n',
          FR: '<p>Referral Bonus</p>\r\n',
          IT: '<p>Referral Bonus</p>\r\n',
          JA: '<p>Referral Bonus</p>\r\n',
          PT: '<p>Referral Bonus</p>\r\n'
        }),
        term_and_condition: JSON.stringify({
          DE: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          DU: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          EN: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          ES: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          FI: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          FR: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          IT: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          JA: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n',
          PT: '<p><span style="color: rgb(116,120,141);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, sans-serif;">Referral Bonus</span>&nbsp;</p>\r\n'
        }),
        valid_from: new Date(),
        valid_to: dayjs().add(1, 'year').toDate(),
        days_to_clear: 30,
        wagering_template_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }

      await queryInterface.bulkInsert('bonus', [referralBonus])

      const bonus = await queryInterface.rawSelect(
        'bonus',
        { where: { bonus_type: 'referral' } },
        ['id']
      )

      if (!bonus) {
        console.warn('Referral bonus not found after insertion. Skipping bonus_currencies seeder.')
        return
      }

      const bonusCurrencies = {
        bonus_id: bonus,
        currency_id: currencyId,
        zero_out_threshold: 1,
        wagering_amount: 10,
        meta_data: JSON.stringify({ bonusAmount: 1 }),
        created_at: new Date(),
        updated_at: new Date()
      }

      await queryInterface.bulkInsert('bonus_currencies', [bonusCurrencies])
    } catch (error) {
      console.error('Error in referral bonus seeder:', error.message)
    }
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('bonus', { bonus_type: 'referral' }, {})
    await queryInterface.bulkDelete('bonus_currencies', null, {})
  }
}
