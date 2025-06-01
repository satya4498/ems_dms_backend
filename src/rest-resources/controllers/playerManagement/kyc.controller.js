import { decorateResponse } from '@src/helpers/response.helpers'
import { ActivateKycService } from '@src/services/playerManagement/kyc/activateKyc.service'
import { CreateDocumentLabelService } from '@src/services/playerManagement/kyc/createDocumenLabel.service'
import { DeleteDocumentLabelService } from '@src/services/playerManagement/kyc/deleteDocumenLabel.service'
import { GetDocumentLabelsService } from '@src/services/playerManagement/kyc/getDocumentLabels.service'
import { InactiveKycService } from '@src/services/playerManagement/kyc/inactiveKyc.service'
import { RejectDocumentService } from '@src/services/playerManagement/kyc/rejectDocument.service'
import { RequestDocumentService } from '@src/services/playerManagement/kyc/requestDocument.service'
import { UpdateDocumentLabelService } from '@src/services/playerManagement/kyc/updateDocumenLabel.service'
import { VerifyDocumentService } from '@src/services/playerManagement/kyc/verifyDocument.service'
import { VerifyEmailService } from '@src/services/playerManagement/kyc/verifyEmail.service'
import { KycRequestsService } from '@src/services/playerManagement/kyc/kycRequests.service'
import { GetKycMethodsService } from '@src/services/playerManagement/kyc/getKycMethods'
import { ToggleKycMethodService } from '@src/services/playerManagement/kyc/toggleKycMethod'

export class KycController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getDocumentLabels (req, res, next) {
    try {
      const result = await GetDocumentLabelsService.execute(req.query, req.context)
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
  static async requestDocument (req, res, next) {
    try {
      const result = await RequestDocumentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async verifyDocument (req, res, next) {
    try {
      const result = await VerifyDocumentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async rejectDocument (req, res, next) {
    try {
      const result = await RejectDocumentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async verifyEmail (req, res, next) {
    try {
      const result = await VerifyEmailService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async activateKyc (req, res, next) {
    try {
      const result = await ActivateKycService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async inactiveKyc (req, res, next) {
    try {
      const result = await InactiveKycService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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

  static async kycRequests (req, res, next) {
    try {
      const result = await KycRequestsService.execute({ ...req.params,...req.query, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async createDocumentLabel (req, res, next) {
    try {
      const result = await CreateDocumentLabelService.execute(req.body, req.context)
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
  static async deteleDocumentLabel (req, res, next) {
    try {
      const result = await DeleteDocumentLabelService.execute(req.body, req.context)
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
  static async updateDocumentLabel (req, res, next) {
    try {
      const result = await UpdateDocumentLabelService.execute(req.body, req.context)
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
  static async toggleKycMethod (req, res, next) {
    try {
      const result = await ToggleKycMethodService.execute(req.body, req.context)
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
   static async getKycMethods (req, res, next) {
    try {
      const result = await GetKycMethodsService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
