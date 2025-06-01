
import _ from 'lodash';
const { sequelize } = require('../../src/database/models')

sequelize.options.logging = false

export async function BulkcreateLimitsOfTheUsers() {

  const users = await sequelize.models.user.findAll({
    attributes: ['id']
  })


  try {
    const promises = users.map(async user => {
        const limit = await sequelize.models.userLimit.findOne({
            where: {
                userId: user.id
            }
        })

        if(limit){
            console.log(`limits already exists userId- ${user.id}`)
            return null
        }

        await sequelize.models.userLimit.createAll(user.id)
        console.log(`limits inserted userId- ${user.id}`)

    })

    await Promise.all(promises)
  } catch (error) {
    console.log(error)
  }
  return true
}
