import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserGamificationTaskProgress extends ModelBase {
  static model = 'userGamificationTaskProgress'

  static table = 'user_gamification_task_progress'

  static options = {
    name: {
      singular: 'userGamificationTaskProgress',
      plural: 'userGamificationTaskProgresses'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    taskId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    amountWagered: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    amountToWager: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    depositAmountRequired: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    depositAmountAchieved: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    depositCountRequired: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    depositCountAchieved: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    betCountRequired: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'bet_count_required',
      defaultValue: 0
    },
    betCountAchieved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'bet_count_achieved',
      defaultValue: 0
    },
    gameCountRequired: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'game_count_required',
      defaultValue: 0
    },
    gameCountAchieved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'game_count_achieved',
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'claimed'),
      allowNull: false,
      defaultValue: 'in_progress'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    }
  }

  static associate (models) {
    UserGamificationTaskProgress.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })

    UserGamificationTaskProgress.belongsTo(models.gamificationTask, {
      foreignKey: 'taskId',
      onDelete: 'CASCADE'
    })

    UserGamificationTaskProgress.belongsTo(models.casinoGame, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    })

    super.associate()
  }
}
