import { decorateResponse } from '@src/helpers/response.helpers'
import { SendOtpService } from '@src/services/user/sendOtp.service'
import { VerifyOtpService } from '@src/services/user/verifyOtp.service'
import { GetUserProfileService } from '@src/services/user/getUserProfile.service'
import { UpdateProfileService } from '@src/services/user/updateProfile.service'
import { GetTransactionHistoryService } from '@src/services/user/getTransactionHistory.service'
import { GetUsersService } from '@src/services/user/getUsers.service'
export class UserController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async sendOtp (req, res, next) {
    try {
      const result = await SendOtpService.execute({ ...req.body, image: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async verifyOtp (req, res, next) {
    try {
      const result = await VerifyOtpService.execute({ ...req.body, image: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getProfile (req, res, next) {
    try {
      const result = await GetUserProfileService.execute({ ...req.query, image: req.file, ...req.authenticated }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async updateProfile (req, res, next) {
    try {
      const result = await UpdateProfileService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getTransactionHistory (req, res, next) {
    try {
      const result = await GetTransactionHistoryService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getUsers (req, res, next) {
    try {
      const result = await GetUsersService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getUserTransactionHistory (req, res, next) {
    try {
      const result = await GetTransactionHistoryService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
