import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Offer extends ModelBase {
  static model = 'offer'

  static table = 'offers'

  static options = {
    name: {
      singular: 'offer',
      plural: 'offers'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Target user id, null for global offers'
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Admin user id who created the offer'
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    transactionFundId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Transaction fund id'
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
    this.belongsTo(models.user, { foreignKey: 'userId' })
    this.belongsTo(models.user, { foreignKey: 'createdBy' })
    super.associate()
  }
}
