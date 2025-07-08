import { appConfig } from '@src/configs'
import AuthenticationError from '@src/errors/authentication.error'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { errorTypes } from '@src/utils/constants/error.constants'
import Jwt from 'jsonwebtoken'

/**
 * @param {string} permission
 * @returns {import('express').RequestHandler}
 */
export function isAuthenticated (role) {
  return async function (req, _, next) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1]
      if (!accessToken) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      const decodedToken = Jwt.verify(accessToken, appConfig.jwt.secret)
      if (decodedToken.type !== JWT_TOKEN_TYPES.LOGIN) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      // check jwt token in redis against the accessToken
      // const tokenObject = await Cache.get(`admin:${decodedToken.adminUserId}`)
      // if(!tokenObject || tokenObject.token!==accessToken) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      if (role && decodedToken?.role !== role) return next(new AuthenticationError(errorTypes.NotEnoughPermissionErrorType))

      req.authenticated = {
        userId: decodedToken.userId,
        phone: decodedToken?.phone,
        role: decodedToken?.role,
        phoneCode: decodedToken?.phoneCode,
        isNewUser: decodedToken?.isNewUser,
        type: decodedToken?.type
      }

      // will be used for activity logs
      req.modulePermission = {
        permission: true,
        role: decodedToken?.role
      }
      next()
    } catch (error) {
      next(new AuthenticationError(error))
    }
  }
}
