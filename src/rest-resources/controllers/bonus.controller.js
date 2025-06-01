import { decorateResponse } from '@src/helpers/response.helpers'
import { CancelBonusService } from '@src/services/bonus/cancelBonus.service'
import { CreateBonusService } from '@src/services/bonus/createBonus.service'
import { CreateWageringTemplateService } from '@src/services/bonus/createWageringTemplate.service'
import { GetAllBonusService } from '@src/services/bonus/getAllBonus.service'
import { GetAllWageringTemplatesService } from '@src/services/bonus/getAllWageringTemplates.service'
import { GetWageringTemplateDetailService } from '@src/services/bonus/getWageringTemplateDetail.service'
import { IssueBonusService } from '@src/services/bonus/issueBonus.service'
import { ReorderBonusService } from '@src/services/bonus/orderBonus.service'
import { UpdateWageringTemplateService } from '@src/services/bonus/updateWageringTemplate.service'
import { ToggleBonusService } from '@src/services/bonus/toggleBonus.service'
import { GetUserBonusService } from '@src/services/bonus/getUserBonus.service'
import { DeleteBonusService } from '@src/services/bonus/deleteBonus.service'
import { GetBonusDetailService } from '@src/services/bonus/getBonusDetail.service'
import { UpdateBonusService } from '@src/services/bonus/updateBonus.service'
import { GetSpinWheelConfigurationService } from '@src/services/bonus/getSpinWheelConfiguration'
import { UpdateSpinWheelBonusService } from '@src/services/bonus/updateSpinWheelConfiguration.service'
import { DeleteSpinWheelConfigService } from '@src/services/bonus/deleteSpinWheelConfiguration'
import { GetAllBonusCountService } from '@src/services/bonus/getAllBonusCount.service'
import { UpdateLoyaltyLevelService } from '@src/services/bonus/updateLoyaltyLevel.service'
import { DeleteLoyaltyLevelService } from '@src/services/bonus/deleteLoyaltyLevel.service'
import { GetAllLoyaltyLevelsService } from '@src/services/bonus/getLoyaltyLevels.service'
import { CreateLoyaltyLevelsService } from '@src/services/bonus/createLoyaltyLevelService'
import { GetLoyaltyLevelUsers } from '@src/services/bonus/getLoyaltyUsers.service'

export default class BonusController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createBonus (req, res, next) {
    try {
      const result = await CreateBonusService.execute({ ...req.body, bonusImage: req.file }, req.context)
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
  static async updateBonus (req, res, next) {
    try {
      const result = await UpdateBonusService.execute({ ...req.body, bonusImage: req.file }, req.context)
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
  static async issueBonus (req, res, next) {
    try {
      const result = await IssueBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async cancelBonus (req, res, next) {
    try {
      const result = await CancelBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getUserBonus (req, res, next) {
    try {
      const result = await GetUserBonusService.execute(req.query, req.context)
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
  static async getAllBonus (req, res, next) {
    try {
      const result = await GetAllBonusService.execute(req.query, req.context)
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
  static async getBonusDetail (req, res, next) {
    try {
      const result = await GetBonusDetailService.execute(req.query, req.context)
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
  // static async deleteBonus (req, res, next) {
  //   try {
  //     const { result, successful, errors } = await DeleteBonusService.execute(req.body, req.context)
  //     sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async deleteBonus (req, res, next) {
    try {
      const result = await DeleteBonusService.execute(req.body, req.context)
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
  // static async convertAmount (req, res, next) {
  //   try {
  //     const { result, successful, errors } = await ConvertAmountService.execute(req.query)
  //     sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createWageringTemplate (req, res, next) {
    try {
      const result = await CreateWageringTemplateService.execute(req.body, req.context)
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
  static async updateWageringTemplate (req, res, next) {
    try {
      const result = await UpdateWageringTemplateService.execute(req.body, req.context)
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
  static async getAllWageringTemplates (req, res, next) {
    try {
      const result = await GetAllWageringTemplatesService.execute(req.query, req.context)
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
  static async getWageringTemplateDetails (req, res, next) {
    try {
      const result = await GetWageringTemplateDetailService.execute(req.query, req.context)
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
  static async reorderBonuses (req, res, next) {
    try {
      const result = await ReorderBonusService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async toggleBonus (req, res, next) {
    try {
      const result = await ToggleBonusService.execute(req.body, req.context)
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
    static async getSpinWheelConfigurations (req, res, next) {
      try {
        const result = await GetSpinWheelConfigurationService.execute(req.query, req.context)
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
    static async updateSpinWheelConfig (req, res, next) {
      try {
        const result = await UpdateSpinWheelBonusService.execute({ ...req.body }, req.context)
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
    static async deleteSpinWheelConfig (req, res, next) {
      try {
        const result = await DeleteSpinWheelConfigService.execute({ ...req.body }, req.context)
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
    static async getAllBonusCount (req, res, next) {
      try {
        const result = await GetAllBonusCountService.execute(req.query, req.context)
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
  static async createLoyaltyLevels (req, res, next) {
    try {
      const result = await CreateLoyaltyLevelsService.execute({ ...req.body, iconImage: req.file }, req.context)
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
  static async updateLoyaltyLevels (req, res, next) {
    try {
      const result = await UpdateLoyaltyLevelService.execute({ ...req.body, iconImage: req.file }, req.context)
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
  static async deleteLoyaltyLevels (req, res, next) {
    try {
      const result = await DeleteLoyaltyLevelService.execute(req.body, req.context)
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
  static async getLoyaltyLevels (req, res, next) {
    try {
      const result = await GetAllLoyaltyLevelsService.execute(req.query, req.context)
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
   static async getLoyaltyLevelUsers (req, res, next) {
    try {
      const result = await GetLoyaltyLevelUsers.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

}
