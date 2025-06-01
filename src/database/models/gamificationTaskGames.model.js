import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class GamificationTaskGame extends ModelBase {
  static model = 'gamificationTaskGame'

  static table = 'gamification_task_games'

  static options = {
    name: {
      singular: 'gamificationTaskGame',
      plural: 'gamificationTaskGames'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minBetAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }

  static associate (models) {
    GamificationTaskGame.belongsTo(models.gamificationTask, {
      foreignKey: 'taskId',
      onDelete: 'CASCADE'
    })

    GamificationTaskGame.belongsTo(models.casinoGame, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    })

    super.associate()
  }
}
