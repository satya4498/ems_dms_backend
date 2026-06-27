import { decorateResponse } from '@src/helpers/response.helpers'
import { GetUserProfileService } from '@src/services/user/getUserProfile.service'
import { GetUsersService } from '@src/services/user/getUsers.service'
import { SignUpService } from '@src/services/user/signUp.service'
import { SignInService } from '@src/services/user/signIn.service'
import { ForgotPasswordService } from '@src/services/user/forgotPassword.service'
import { ResetPasswordService } from '@src/services/user/resetPassword.service'
import { SendEmailOtpService } from '@src/services/user/sendEmailOtp.service'
import { VerifyEmailOtpService } from '@src/services/user/verifyEmailOtp.service'
import { ToggleUserService } from '@src/services/user/toogleUser.service'
import { UpdateUserService } from '@src/services/user/updateUser.service'
export class UserController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async sendEmailOtp (req, res, next) {
    try {
      const result = await SendEmailOtpService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async verifyEmailOtp (req, res, next) {
    try {
      const result = await VerifyEmailOtpService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async forgotPassword (req, res, next) {
    try {
      const result = await ForgotPasswordService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async resetPassword (req, res, next) {
    try {
      const result = await ResetPasswordService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async signIn (req, res, next) {
    try {
      const result = await SignInService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async signUp (req, res, next) {
    try {
      const result = await SignUpService.execute({ ...req.body }, req.context)
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
  static async getUsers (req, res, next) {
    try {
      const result = await GetUsersService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const result = await UpdateUserService.execute({ ...req.body, image: req.file, ...req.authenticated }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async toggleUser (req, res, next) {
    try {
      const result = await ToggleUserService.execute({ ...req.body, ...req.authenticated }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
