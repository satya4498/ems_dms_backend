import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import _ from 'lodash'
import { Op } from 'sequelize'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    taskId: { type: 'number' },
    name: { type: 'object' },
    description: { type: 'object' },
    validFrom: { type: 'string' },
    validTo: { type: 'string' },
    conditions: {
      type: 'string',
      properties: {
        condition: { type: 'string', enum: ['AND', 'OR'] },
        rules: {
          type: 'array',
          items: {
            anyOf: [
              {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  operator: { type: 'string', enum: ['>', '<', '>=', '<=', '==', '!='] },
                  value: { type: ['number', 'string'] }
                },
                required: ['key', 'operator', 'value'],
                additionalProperties: false
              },
              { $ref: '#' }
            ]
          }
        }
      },
      required: ['condition', 'rules'],
      additionalProperties: false
    },
    isActive: { type: 'boolean' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          currencyId: { type: 'string' },
          type: { type: 'string', enum: Object.values(CURRENCY_TYPES) },
          bonusAmount: { type: 'number' }
        },
        required: ['currencyId', 'type'],
        additionalProperties: false
      }
    },
    imageUrl: { type: 'object' },
    games: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          gameId: { type: 'number' },
          minBetAmount: { type: 'number' }
        },
        required: ['gameId', 'minBetAmount'],
        additionalProperties: false
      }
    },
    tagIds: { type: 'array' }
  },
  required: ['taskId']
})

export class UpdateGamificationTaskService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      taskId,
      name,
      description,
      conditions,
      isActive,
      imageUrl,
      games,
      currencyDetails,
      tagIds,
      validFrom,
      validTo
    } = this.args

    const {
      gamificationTask: gamificationTaskModel,
      gamificationTaskGame: gamificationTaskGameModel,
      gamificationTaskCurrency: gamificationTaskCurrencyModel,
      currency: currencyModel
    } = this.context.sequelize.models

    try {
      const task = await gamificationTaskModel.findOne({ where: { id: taskId } })
      if (!task) {
        return this.addError('TaskNotFoundError')
      }

      if (name) task.name = await getLanguageWiseNameJson(name)
      if (description) task.description = await getLanguageWiseNameJson(description)
      task.tagIds = tagIds !== undefined ? tagIds : []
      if (validFrom) task.validFrom = validFrom
      if (validTo) task.validTo = validTo

      // Update and check for duplicate condition
      if (conditions) {
        const parsedCondition = JSON.parse(conditions)

        const existingTasks = await gamificationTaskModel.findAll({
          where: {
            gamificationId: task.gamificationId,
            id: { [Op.ne]: taskId }
          },
          attributes: ['id', 'conditions']
        })

        const isDuplicateCondition = existingTasks.some(t => {
          try {
            const existingCondition = typeof t.conditions === 'string' ? JSON.parse(t.conditions) : t.conditions
            return _.isEqual(existingCondition, parsedCondition)
          } catch {
            return false
          }
        })

        if (isDuplicateCondition) {
          return this.addError('AlreadyTaskWithSameConditionExist')
        }

        task.conditions = parsedCondition
      }

      if (_.isBoolean(isActive)) task.isActive = isActive
      // Upload image if provided
      if (imageUrl) {
        const uploadedUrl = await uploadFile(imageUrl.buffer, {
          name: task.id,
          mimetype: imageUrl.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.gamification.task
        })
        task.imageUrl = uploadedUrl
      }

      await task.save({ transaction })

      if (_.isArray(games)) {
        const taskGameCombosToUpdate = games.map(({ gameId, minBetAmount }) => `${gameId}-${Number(minBetAmount)}`)
        const newComboSet = new Set(taskGameCombosToUpdate)

        const existingTasksWithGames = await gamificationTaskModel.findAll({
          where: {
            gamificationId: task.gamificationId,
            id: { [Op.ne]: taskId }
          },
          include: [
            {
              model: gamificationTaskGameModel,
              as: 'taskGames',
              attributes: ['gameId', 'minBetAmount']
            }
          ]
        })

        const isExactDuplicate = existingTasksWithGames.some(t => {
          const existingComboSet = new Set(t.taskGames.map(g => `${g.gameId}-${Number(g.minBetAmount)}`))
          if (existingComboSet.size !== newComboSet.size) return false
          for (const combo of existingComboSet) {
            if (!newComboSet.has(combo)) return false
          }
          return true
        })

        if (isExactDuplicate) {
          return this.addError('DuplicateTaskGameCombinationError')
        }

        await gamificationTaskGameModel.destroy({ where: { taskId: task.id }, transaction })

        const enrichedGames = games.map(g => ({
          taskId: task.id,
          gameId: g.gameId,
          minBetAmount: g.minBetAmount
        }))

        await gamificationTaskGameModel.bulkCreate(enrichedGames, { transaction })
      }

      // Update currencyDetails if provided
      if (_.isArray(currencyDetails)) {
        // Delete old currencies
        await gamificationTaskCurrencyModel.destroy({ where: { taskId: task.id }, transaction })

        // Validate all provided currencies exist
        const enrichedCurrencyDetails = await Promise.all(
          currencyDetails.map(async (currency) => {
            const foundCurrency = await currencyModel.findOne({ where: { id: currency.currencyId } })
            if (foundCurrency) {
              return {
                ...currency,
                taskId: task.id,
                ...(currency?.bonusAmount ? { bonusAmount: currency.bonusAmount } : {})
              }
            }
            return null
          })
        )

        if (_.includes(enrichedCurrencyDetails, null)) {
          return this.addError('InvalidCurrencyDetailsErrorType')
        }

        await gamificationTaskCurrencyModel.bulkCreate(enrichedCurrencyDetails, { transaction })
      }

      return { gamificationTask: task }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
