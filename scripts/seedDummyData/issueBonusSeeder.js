import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils';
import _ from 'lodash';
import path from 'path';
import { Op } from 'sequelize';
const { sequelize } = require('../../src/database/models')
const { Worker } = require('worker_threads');
const { runner } = require('./issueWelcomeBonus.worker');

sequelize.options.logging = false

export async function issueFakeBonuses(count, timePeriod) {

  // get all users
  const users = await sequelize.models.user.findAll({
    attributes: ['id']
  })

  if(!users.length) return false

  // get the welcome bonus
  const welcomeBonus = await sequelize.models.bonus.findOne({
    attributes: ['id', 'claimedCount'],
    where: {
      bonusType: BONUS_TYPES.JOINING,
      isActive: true
    },
    include: {
      model: sequelize.models.bonusCurrency,
      include: {
        model: sequelize.models.currency,
        where:  { code : { [Op.in]: ['GC', 'BSC'] }},
        required: true
      }
    },
  })  

  if(!welcomeBonus) return false

  try {

    // insert the user bonus
    await runner( { convertedUsers: users, count, timePeriod, welcomeBonus: welcomeBonus  })

  } catch (error) {
    console.log(error)
  }
  return true
}
