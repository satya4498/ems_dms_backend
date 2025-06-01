// 3rd party libs
// import ajv from '../../libs/ajv'
import _ from 'lodash'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'

// libs
import { ServiceBase } from '@src/libs/serviceBase'

// constants
import { SUCCESS_MSG, GROUP_CRITERIA_ARRAY } from '@src/utils/constants/app.constants.js'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    chatGroupId: { type: 'number' },
    name: { type: ['string', 'null'], transform: ['trim', 'toLowerCase'] },
    description: { type: ['string', 'null'] },
    status: { type: 'boolean' },
    criteria: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    isGlobal: {
      type: 'boolean'
    }
  },
  required: ['chatGroupId']
})
export default class UpdateChatGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { chatGroupId, name, description, status, criteria, isGlobal } = this.args
    const transaction = this.context.sequelizeTransaction
    const ChatGroupModel = this.context.sequelize.models.chatGroup

    let filteredCriteria = []

    try {

      // get group details
      const group = await ChatGroupModel.findOne({
        where: { id: chatGroupId },
        transaction
      })

      // if group is already exists
      if (!group) return this.addError("ThisGroupDoesNotExistsErrorType")

      // check if name already exists
      if (name && name != group.name) {
        const groupNameExists = await ChatGroupModel.findOne({
          where: { name, id: { [Op.not]: chatGroupId } },
          transaction
        })

        if (groupNameExists) return this.addError("ThisGroupNameAlreadyExistsErrorType")
      }
      // if criteria is present
      if (criteria && !_.isEmpty(criteria)) {
        // check each record if exists
        for (let record of criteria) {
          if (!GROUP_CRITERIA_ARRAY.includes(record.key)) return this.addError("ThisCriteriaDoesNotExistsErrorType")
          if (!filteredCriteria.includes(record.key)) filteredCriteria.push({ key: record.key, value: record.value })
        }
      }

      // check condition if there is already a global group present
      if (isGlobal && !group.isGlobal) {
        const globalGroup = await ChatGroupModel.findOne({
          where: { isGlobal: true },
          transaction
        })
        if (globalGroup) return this.addError("GlobalGroupExistErrorType")
      }
      // data to be insert
      const dataToInsert = {
        name,
        description,
        status,
        criteria: filteredCriteria,
        admins: [],
        isGlobal
      }
      const groupData = await ChatGroupModel.update(dataToInsert, { where: { id: chatGroupId }, transaction })

      return { group: groupData, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
