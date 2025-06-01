import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
// import { GAMIFICATION_TASK_TYPE } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gamificationId: { type: 'number' },
    name: { type: 'object' },
    description: { type: 'object' },
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
          bonusAmount: { type: 'number', default: 0 }
        },
        required: ['currencyId', 'type', 'bonusAmount'],
        additionalProperties: false
      }
    },
    batchTitle: { type: 'string' },
    validFrom: { type: 'string' },
    validTo: { type: 'string' },
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
  required: ['gamificationId', 'name', 'isActive', 'currencyDetails']
})

export class CreateGamificationTaskService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      gamificationId,
      name,
      description,
      taskType,
      conditions,
      isActive,
      currencyDetails,
      batchTitle,
      validFrom,
      validTo,
      imageUrl,
      games,
      tagIds
    } = this.args

    const {
      gamification: gamificationModel,
      gamificationTaskGame: gamificationTaskGameModel,
      gamificationTask: gamificationTaskModel,
      currency: currencyModel
    } = this.context.sequelize.models

    try {
      // Check if the referenced gamification exists
      const gamification = await gamificationModel.findOne({
        where: { id: gamificationId }
      })

      if (!gamification) {
        return this.addError('GamificationDoesNotExistError')
      }

      const taskData = {
        gamificationId,
        name: await getLanguageWiseNameJson(name),
        description: description ? await getLanguageWiseNameJson(description) : null,
        taskType,
        conditions: this.args.conditions ? JSON.parse(this.args.conditions) : null,
        isActive,
        batchTitle,
        validFrom,
        validTo,
        imageUrl: null,
        claimCount: 0,
        tagIds: tagIds || []
      }

      const newCondition = conditions ? JSON.parse(conditions) : null

      // Condition duplicate check
      if (newCondition) {
        const existingTasks = await gamificationTaskModel.findAll({
          where: { gamificationId },
          attributes: ['id', 'conditions']
        })

        const isDuplicate = existingTasks.some(task => {
          if (!task.conditions) return false
          try {
            const existingCondition = typeof task.conditions === 'string'
              ? JSON.parse(task.conditions)
              : task.conditions
            return _.isEqual(existingCondition, newCondition)
          } catch {
            return false
          }
        })

        if (isDuplicate) {
          return this.addError('AlreadyTaskWithSameConditionExist')
        }
      }

      if (_.size(games)) {
        const taskGameCombosToAdd = games.map(({ gameId, minBetAmount }) => ({
          gameId,
          minBetAmount: Number(minBetAmount)
        }))

        const newTaskComboSet = new Set(
          taskGameCombosToAdd.map(g => `${g.gameId}-${g.minBetAmount}`)
        )

        const existingTasksWithGames = await gamificationTaskModel.findAll({
          where: { gamificationId },
          include: [
            {
              model: gamificationTaskGameModel,
              as: 'taskGames',
              attributes: ['gameId', 'minBetAmount']
            }
          ]
        })
        console.log(existingTasksWithGames, 'existing task games')
        const isExactDuplicateTask = existingTasksWithGames.some(task => {
          const existingComboSet = new Set(
            task.taskGames.map(g => `${g.gameId}-${Number(g.minBetAmount)}`)
          )

          // Check if sets are exactly the same
          if (existingComboSet.size !== newTaskComboSet.size) return false

          for (const combo of existingComboSet) {
            if (!newTaskComboSet.has(combo)) return false
          }

          return true
        })

        if (isExactDuplicateTask) {
          return this.addError('DuplicateTaskGameCombinationError')
        }
      }

      // Create the gamification task record
      const gamificationTask = await gamificationTaskModel.create(taskData, { transaction })

      const enrichedCurrencyDetails = await Promise.all(currencyDetails.map(async (currency) => {
        const currencyExists = await currencyModel.findOne({ where: { id: currency.currencyId } })
        if (!currencyExists) return null
        return {
          ...currency,
          taskId: gamificationTask.id
        }
      }))

      if (_.includes(enrichedCurrencyDetails, null)) {
        return this.addError('InvalidCurrencyDetailsErrorType')
      }

      await this.context.sequelize.models.gamificationTaskCurrency.bulkCreate(enrichedCurrencyDetails, { transaction })

      if (imageUrl) {
        const fileLocation = await uploadFile(imageUrl.buffer, {
          name: gamificationTask.id,
          mimetype: imageUrl.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.gamification.task
        })
        gamificationTask.imageUrl = fileLocation
        await gamificationTask.save({ transaction })
      }

      if (_.size(games)) {
        const gameEntries = games.map(({ gameId, minBetAmount }) => ({
          taskId: gamificationTask.id,
          gameId,
          minBetAmount
        }))
        await gamificationTaskGameModel.bulkCreate(gameEntries, { transaction })
      }

      return { gamificationTask }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
