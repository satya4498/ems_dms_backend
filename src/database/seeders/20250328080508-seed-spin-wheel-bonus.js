module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bonusTypes = ['daily-spin-wheel', 'weekly-spin-wheel', 'monthly-spin-wheel']

    const bonuses = await Promise.all(
      bonusTypes.map(async (type) => {
        return queryInterface.rawSelect(
          'bonus',
          { where: { bonus_type: type } },
          ['id']
        )
      })
    )

    const validBonuses = bonuses.filter(Boolean)

    if (!validBonuses.length) throw new Error('No matching bonus types found')

    const currencyId = await queryInterface.rawSelect(
      'currencies',
      { where: { code: 'BSC' } },
      ['id']
    )

    if (!currencyId) throw new Error('Currency ID for BSC not found')

    const lastInsertedId = await queryInterface.rawSelect(
      'wheel_division_configurations',
      { order: [['id', 'DESC']] },
      ['id']
    )

    let nextId = lastInsertedId ? lastInsertedId + 1 : 1

    const wheelConfigurations = []

    for (const bonusId of validBonuses) {
      for (let probability = 1; probability <= 16; probability++) {
        const wheelConfigId = nextId++

        wheelConfigurations.push({
          id: wheelConfigId,
          bonus_id: bonusId,
          is_allow: true,
          gc: Math.floor(Math.random() * 50) + 1,
          sc: Math.floor(Math.random() * 50) + 1,
          probability,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('wheel_division_configurations', wheelConfigurations)
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('wheel_division_configurations', null, {})
  }
}
