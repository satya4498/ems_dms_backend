import { decorateResponse } from '@src/helpers/response.helpers'
import { ReplyDisputeMessageService } from '@src/services/crm/disputeManagement/replyDisputeMessage.service'
import { UpdateDisputeStatusService } from '@src/services/crm/disputeManagement/updateDisputeStatus.service'
import { GetThreadDetailsService } from '@src/services/crm/disputeManagement/getThreadDetails.service'
import { GetUserDisputesService } from '@src/services/crm/disputeManagement/getUserDisputes.service'
import { UpdateMessageReadService } from '@src/services/crm/disputeManagement/updateMessageRead.service'

export class UserDisputeController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getTicket (req, res, next) {
    try {
      const result = await GetUserDisputesService.execute({ ...req.query }, req.context)
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
  static async replyMessage (req, res, next) {
    try {
      const result = await ReplyDisputeMessageService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId, adminUserName: req.authenticated.adminUserName, file: req.file }, req.context)
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
  static async getTicketDetails (req, res, next) {
    try {
      const result = await GetThreadDetailsService.execute({ ...req.query }, req.context)
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
  static async updateMessageRead (req, res, next) {
    try {
      const result = await UpdateMessageReadService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async updateStatus (req, res, next) {
    try {
      const result = await UpdateDisputeStatusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
