import { SPORTSBOOK_TRANSACTION_STATUS, SPORTSBOOK_TRANSACTION_TYPE } from '@src/utils/constants/sportbookManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class SportsbookTransaction extends ModelBase {
  static model = 'sportsbookTransaction'

  static table = 'sportsbook_transactions'

  static options = {
    name: {
      singular: 'sportsbook_transaction',
      plural: 'sportsbook_transactions'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    betType: {
      type: DataTypes.ENUM(Object.values(SPORTSBOOK_TRANSACTION_TYPE)),
      allowNull: false
    },
    betId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(SPORTSBOOK_TRANSACTION_STATUS)),
      allowNull: false,
      defaultValue: SPORTSBOOK_TRANSACTION_STATUS.PENDING
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
    SportsbookTransaction.belongsTo(models.user, { foreignKey: 'userId' })
    SportsbookTransaction.hasMany(models.ledger, {
      foreignKey: 'transactionId', onDelete: 'cascade', scope: {
        commentableType: 'video',
      }
    })
    SportsbookTransaction.belongsTo(models.sportsbookTransaction, { foreignKey: 'betId' })
    SportsbookTransaction.belongsTo(models.exchangeBet, { foreignKey: 'betId', constraints: false, as: 'exchangeBet' })
    SportsbookTransaction.belongsTo(models.betslip, { foreignKey: 'betId', constraints: false, as: 'sportsbookBetslip' })

    super.associate()
  }
}
