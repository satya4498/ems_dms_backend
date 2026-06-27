import { USER_GENDER, USER_ROLE } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class User extends ModelBase {
  static model = 'user'

  static table = 'users'

  static options = {
    name: {
      singular: 'user',
      plural: 'users'
    }
  }

  // static jsonSchemaOptions = {
  //   exclude: ['password']
  // }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 255]
      },
      comment: 'Email address of the user'
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [10, 15]
      },
      comment: 'Phone number of the user'
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(Object.values(USER_GENDER)),
      allowNull: true
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastLoggedInIp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loggedInAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM(Object.values(USER_ROLE)),
      allowNull: false,
      defaultValue: USER_ROLE.USER
    },
    contactId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fundAccountId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'RazorpayX fund account ID for payouts'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }

  static associate (models) {
    super.associate()
    // this.hasMany(models.payoutQrCode, { foreignKey: 'createdBy' })
    // this.hasMany(models.payoutQrCodeRedemption, { foreignKey: 'userId' })
    // this.hasMany(models.payoutQrCodeRedemption, { foreignKey: 'adminId', as: 'adminRedemptions' })
    // this.hasOne(models.wallet, { foreignKey: 'userId' })
  }
}
