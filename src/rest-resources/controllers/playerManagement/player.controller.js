import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateCommentService } from '@src/services/playerManagement/createComment.service'
import { DeleteCommentService } from '@src/services/playerManagement/deleteComment.service'
import { GetDuplicatePlayersService } from '@src/services/playerManagement/getDuplicatePlayers.service'
import { GetPlayerService } from '@src/services/playerManagement/getPlayer.service'
import { GetPlayersService } from '@src/services/playerManagement/getPlayers.service'
import { ManageUserWalletService } from '@src/services/playerManagement/manageUserWallet.service'
import { ResetPlayerPasswordService } from '@src/services/playerManagement/resetPlayerPassword.service'
import { TogglePlayerService } from '@src/services/playerManagement/togglePlayer.service'
import { UpdateCommentService } from '@src/services/playerManagement/updateComment.service'
import { UpdatePlayerService } from '@src/services/playerManagement/updatePlayer.service'
import { UpdatePlayerPasswordService } from '@src/services/playerManagement/updatePlayerPassword.service'
import { GetSportsbookBetService } from '@src/services/sportsbookManagement/getSportsbookBet.service'
import { GetSportsbookBetsService } from '@src/services/sportsbookManagement/getSportsbookBets.service'
import { GetCasinoTransactionsService } from '@src/services/transaction/getCasinoTransactions.service'
import { GetLedgersService } from '@src/services/transaction/getLedgers.service'
import { CreateNotification } from '@src/services/playerManagement/notification/createNotification.service'
import { GetAllNotificationService } from '@src/services/playerManagement/notification/getAllNotification.service'
import { GetCommentService } from '@src/services/playerManagement/getComment.service'
import { GetAllDuplicatePlayersService } from '@src/services/playerManagement/getAllDuplicatePlayers'

export class PlayerController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPlayers (req, res, next) {
    try {
      const result = await GetPlayersService.execute(req.query, req.context)
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
  static async getPlayer (req, res, next) {
    try {
      const result = await GetPlayerService.execute(req.query, req.context)
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
  static async getDuplicatePlayers (req, res, next) {
    try {
      const result = await GetDuplicatePlayersService.execute(req.query, req.context)
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
  static async getComment (req, res, next) {
    try {
      const result = await GetCommentService.execute(req.query, req.context)
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
  static async updatePlayer (req, res, next) {
    try {
      const result = await UpdatePlayerService.execute(req.body, req.context)
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
  static async updatePlayerPassword (req, res, next) {
    try {
      const result = await UpdatePlayerPasswordService.execute(req.body, req.context)
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
  static async resetPlayerPassword (req, res, next) {
    try {
      const result = await ResetPlayerPasswordService.execute(req.body, req.context)
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
  static async createComment (req, res, next) {
    try {
      const result = await CreateCommentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateComment (req, res, next) {
    try {
      const result = await UpdateCommentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async deleteComment (req, res, next) {
    try {
      const result = await DeleteCommentService.execute(req.body, req.context)
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
  static async togglePlayer (req, res, next) {
    try {
      const result = await TogglePlayerService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async manageUserWallet (req, res, next) {
    try {
      const result = await ManageUserWalletService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getCasinoBets (req, res, next) {
    try {
      const result = await GetCasinoTransactionsService.execute(req.query, req.context)
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
  static async getSportsbookBets (req, res, next) {
    try {
      const result = await GetSportsbookBetsService.execute(req.query, req.context)
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
  static async getSportsbookBet (req, res, next) {
    try {
      const result = await GetSportsbookBetService.execute(req.query, req.context)
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
  static async getLedgers (req, res, next) {
    try {
      const result = await GetLedgersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createNotification (req, res, next) {
    try {
      const result = await CreateNotification.execute({ ...req.body, notificationImage: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getAllNotification (req, res, next) {
    try {
      const result = await GetAllNotificationService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getAllDuplicatePlayers (req, res, next){
    try {
      const result = await GetAllDuplicatePlayersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
