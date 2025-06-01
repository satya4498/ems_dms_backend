import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class KycDetails extends ModelBase {
  static model = 'kycDetail'

  static table = 'kyc_details'

  static options = {
    name: {
      singular: 'kyc_detail',
      plural: 'kyc_details'
    }
  }


  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    super.associate()
  }
}