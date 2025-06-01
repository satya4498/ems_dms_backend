import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Banner extends ModelBase {
  static model = 'banner'

  static table = 'banners'

  static options = {
    name: {
      singular: 'banner',
      plural: 'banners'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bannerTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'type'
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    mobileImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    desktopImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    redirectionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    Banner.belongsTo(models.bannerTypes, { foreignKey: 'bannerTypeId' })
    super.associate()
  }
}
