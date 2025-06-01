import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class BannerTypes extends ModelBase {
  static model = 'bannerTypes'

  static table = 'banner_types'

  static options = {
    name: {
      singular: 'banner_type',
      plural: 'banner_types'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    BannerTypes.hasMany(models.banner, { foreignKey: 'type' })
    super.associate()
  }
}
