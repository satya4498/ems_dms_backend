import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class CasinoGame extends ModelBase {
  static model = 'casinoGame'

  static table = 'casino_games'

  static options = {
    name: {
      singular: 'casino_game',
      plural: 'casino_games'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['unique_id', 'casino_provider_id']
  }, {
    unique: true,
    fields: ['unique_id', 'casino_provider_id', 'casino_category_id']
  }]

  static attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    casinoCategoryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    casinoProviderId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    returnToPlayer: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    wageringContribution: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    desktopImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    volatilityRating: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hasFreespins: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    devices: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    demoAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    restrictedCountries: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: '[]'
    },
    restrictedStates: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    minBet:{
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    maxBet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    moreDetails: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (models) {
    CasinoGame.hasMany(models.casinoTransaction, { foreignKey: 'gameId' })
    CasinoGame.belongsTo(models.casinoProvider, { foreignKey: 'casinoProviderId' })
    // CasinoGame.belongsTo(models.casinoCategory, { foreignKey: 'casinoCategoryId' })
    CasinoGame.hasMany(models.casinoTournamentGame, { foreignKey: 'casinoGameId' })
    CasinoGame.hasMany(models.tournamentTransaction, { foreignKey: 'casinoGameId' })
    CasinoGame.belongsToMany(models.casinoCategory, { through: models.casinoGameCategory, foreignKey: 'casinoGameId'})
    CasinoGame.hasMany(models.casinoGameCategory)
    super.associate()
  }
}
