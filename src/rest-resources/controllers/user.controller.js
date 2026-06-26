import { decorateResponse } from '@src/helpers/response.helpers'
import { GetUserProfileService } from '@src/services/user/getUserProfile.service'
import { GetUsersService } from '@src/services/user/getUsers.service'
export class UserController {
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
}
