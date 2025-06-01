'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date()

    await queryInterface.bulkInsert('gamification', [
      {
        name: 'Lifetime Milestones',
        description: JSON.stringify({
          en: 'Unlock rewards and special perks as you achieve lifetime milestones like placing 100 bets, depositing $500, or reaching 100 wins.',
          es: 'Desbloquea recompensas y beneficios especiales al alcanzar hitos como realizar 100 apuestas, depositar $500 o lograr 100 victorias.'
        }),
        image_url: null,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Daily Missions',
        description: JSON.stringify({
          en: 'Complete daily tasks like placing 5 bets, wagering $50, or winning $100 to earn exciting rewards.',
          es: 'Completa tareas diarias como hacer 5 apuestas, apostar $50 o ganar $100 para obtener recompensas emocionantes.'
        }),
        image_url: null,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Boosters & Perks',
        description: JSON.stringify({
          en: 'Get time-sensitive boosters like double rewards for selected games, and perks such as exclusive bonuses or odds.',
          es: 'Obtén potenciadores por tiempo limitado como recompensas dobles en juegos seleccionados y beneficios como bonos exclusivos o probabilidades especiales.'
        }),
        image_url: null,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Collectibles',
        description: JSON.stringify({
          en: 'Collect badges, items, and achievements by betting on specific games or completing bet series and events.',
          es: 'Colecciona insignias, objetos y logros apostando en juegos específicos o completando series y eventos de apuestas.'
        }),
        image_url: null,
        created_at: now,
        updated_at: now
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gamification', null, {})
  }
}
