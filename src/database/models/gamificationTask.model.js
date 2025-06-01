import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class GamificationTask extends ModelBase {
  static model = 'gamificationTask'

  static table = 'gamification_tasks'

  static options = {
    name: {
      singular: 'gamificationTask',
      plural: 'gamificationTasks'
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
    gamificationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'gamification_id'
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'name'
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'description'
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'conditions',
      comment: 'Stores dynamic fields like betCountNeeded, depositAmount etc.'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_active'
    },
    batchTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'batch_title'
    },
    validFrom: {
      type: DataTypes.DATE,
      defaultValue: null,
      field: 'valid_from'
    },
    validTo: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
      field: 'valid_to'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url'
    },
    claimCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'claim_count'
    },
    metaData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'meta_data',
      defaultValue: {}
    },
    tagIds: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      allowNull: true,
      defaultValue: []
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
    GamificationTask.belongsTo(models.gamification, {
      foreignKey: 'gamificationId',
      as: 'gamification',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    GamificationTask.hasMany(models.gamificationTaskGame, {
      foreignKey: 'taskId',
      as: 'taskGames'
    })
    GamificationTask.hasMany(models.gamificationTaskCurrency, {
      foreignKey: 'taskId',
      as: 'currencies'
    })

    super.associate?.(models)
  }
}
