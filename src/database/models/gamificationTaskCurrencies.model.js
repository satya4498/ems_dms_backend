import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

export default class GamificationTaskCurrency extends ModelBase {
  static model = 'gamificationTaskCurrency'

  static table = 'gamification_task_currencies'

  static options = {
    name: {
      singular: 'gamificationTaskCurrency',
      plural: 'gamificationTaskCurrencies'
    },
    underscored: true,
    timestamps: true,
    schema: 'public'
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    taskId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'task_id'
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'currency_id'
    },
    type: {
      type: DataTypes.ENUM(Object.values(CURRENCY_TYPES)),
      allowNull: false,
      field: 'type',
      defaultValue: CURRENCY_TYPES.SWEEP_COIN
    },
    bonusAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: 'bonus_amount',
      defaultValue: 0
    },
    metaData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'meta_data',
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }

  static associate (models) {
    GamificationTaskCurrency.belongsTo(models.gamificationTask, {
      foreignKey: 'taskId',
      as: 'task',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    GamificationTaskCurrency.belongsTo(models.currency, {
      foreignKey: 'currencyId',
      as: 'currency',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    super.associate?.(models)
  }
}
