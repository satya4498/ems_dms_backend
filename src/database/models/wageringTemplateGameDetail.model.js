import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class WageringTemplateGameDetail extends ModelBase {
  static model = 'wageringTemplateGameDetail'

  static table = 'wagering_template_game_details'

  static options = {
    name: {
      singular: 'wagering_template_game_detail',
      plural: 'wagering_template_game_details'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['casino_game_id', 'wagering_template_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    casinoGameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    wageringTemplateId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    contributionPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 100
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    WageringTemplateGameDetail.belongsTo(models.casinoGame, { foreignKey: 'casinoGameId' })
    WageringTemplateGameDetail.belongsTo(models.wageringTemplate, { foreignKey: 'wageringTemplateId' })
    super.associate()
  }
}
