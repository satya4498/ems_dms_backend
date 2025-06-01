import { USER_GENDER } from '@src/utils/constants/public.constants.utils'
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

  static jsonSchemaOptions = {
    exclude: ['password']
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    languageId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(Object.values(USER_GENDER)),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
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
    kycStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false
    },
    kycRejectDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    kycMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    loyaltyPoints: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    countryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    stateId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sessionLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    publicAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nonce: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loginMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'email'
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referredBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    chatSettings: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true, // Allows null for users not using 2FA
      comment: 'Secret key for 2FA setup'
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false // Default to false for existing users
    }
  }

  static associate (models) {
    User.hasOne(models.userComment, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.review, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.wallet, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.betslip, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.document, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userLimit, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userBonus, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.withdrawal, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.exchangeBet, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.address, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userTournament, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userTag, { foreignKey: 'userId', onDelete: 'cascade' })
    User.belongsTo(models.country, { foreignKey: 'countryId' })
    User.belongsTo(models.state, { foreignKey: 'stateId' })
    User.belongsTo(models.language, { foreignKey: 'languageId' })
    User.belongsTo(models.user, { foreignKey: 'referredBy', as: 'referral' })
    User.hasMany(models.userChatGroup, { foreignKey: 'userId' })
    User.hasMany(models.mainThread, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.threadMessage, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.usersDepositAddress, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userNotification, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasOne(models.userMetaData, { foreignKey: 'userId', onDelete: 'cascade' })

    super.associate()
  }
}
