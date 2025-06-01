import { decorateResponse } from '@src/helpers/response.helpers'
import { AddGamesCategoryService } from '@src/services/casinoManagement/addGamesCategory.service'
import { CreateCategoryService } from '@src/services/casinoManagement/createCategory.service'
import { DeleteCategoryService } from '@src/services/casinoManagement/deleteCategory.service'
import { EditCategoryService } from '@src/services/casinoManagement/editCategory.service'
import { EditGameService } from '@src/services/casinoManagement/editGame.service'
import { EditProviderService } from '@src/services/casinoManagement/editProvider.service'
import { GameRemoveRestrictedCountriesService } from '@src/services/casinoManagement/gameRemoveRestrictedCountries.service'
import { GameRestrictCountriesService } from '@src/services/casinoManagement/gameRestrictCountries.service'
import { GetAggregatorsService } from '@src/services/casinoManagement/getAggregators.service'
import { GetCategoriesService } from '@src/services/casinoManagement/getCategories.service'
import { GetGamesService } from '@src/services/casinoManagement/getGames.service'
import { GetProvidersService } from '@src/services/casinoManagement/getProviders.service'
import { ProviderRemoveRestrictedCountriesService } from '@src/services/casinoManagement/providerRemoveRestrictedCountries.service'
import { ProviderRestrictCountriesService } from '@src/services/casinoManagement/providerRestrictCountries.service'
import { RemoveGamesFromCategoryService } from '@src/services/casinoManagement/removeGamesFromCategory.service'
import { ReorderCategoriesService } from '@src/services/casinoManagement/reorderCategories.service'
import { ReorderGameService } from '@src/services/casinoManagement/reorderGames.service'
import { ToggleService } from '@src/services/casinoManagement/toggle.service'
import { ToggleFeaturedGameService } from '@src/services/casinoManagement/toggleFeaturedGame.service'
import { GameRemoveRestrictedStatesService } from '@src/services/casinoManagement/gameRemoveRestrictedStates.service'
import { ProviderRemoveRestrictedStatesService } from '@src/services/casinoManagement/providerRemoveRestrictedStates.service'
import { GameRestrictStatesService } from '@src/services/casinoManagement/gameRestrictStates.service'
import { ProviderRestrictStatesService } from '@src/services/casinoManagement/providerRestrictStates.service'
import { ReorderProviderService } from '@src/services/casinoManagement/reorderProvider.service'
import { CreateProviderService } from '@src/services/casinoManagement/createProvider.service'
import { EditAggregatorService } from '@src/services/casinoManagement/editAggregator.service'

export class CasinMoanagementController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAggregators (req, res, next) {
    try {
      const result = await GetAggregatorsService.execute(req.query, req.context)
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
  static async getProviders (req, res, next) {
    try {
      const result = await GetProvidersService.execute(req.query, req.context)
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
  static async getCategories (req, res, next) {
    try {
      const result = await GetCategoriesService.execute(req.query, req.context)
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
  static async getGames (req, res, next) {
    try {
      const result = await GetGamesService.execute(req.query, req.context)
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
  static async createCategory (req, res, next) {
    try {
      const result = await CreateCategoryService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {} }, req.context)
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
   static async createProvider (req, res, next) {
    try {
      const result = await CreateProviderService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {} }, req.context)
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
  static async reorderCategory (req, res, next) {
    try {
      const result = await ReorderCategoriesService.execute(req.body, req.context)
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
  static async addGamesCategory (req, res, next) {
    try {
      const result = await AddGamesCategoryService.execute(req.body, req.context)
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
  static async removeGamesFromCategory (req, res, next) {
    try {
      const result = await RemoveGamesFromCategoryService.execute(req.body, req.context)
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
  static async deleteCategory (req, res, next) {
    try {
      const result = await DeleteCategoryService.execute(req.body, req.context)
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
  static async removeRestrictedCountryGame (req, res, next) {
    try {
      const result = await GameRemoveRestrictedCountriesService.execute(req.body, req.context)
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
static async removeRestrictedStateGame (req, res, next) {
  try {
    const result = await GameRemoveRestrictedStatesService.execute(req.body, req.context)
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
  static async removeRestrictedCountryProvider (req, res, next) {
    try {
      const result = await ProviderRemoveRestrictedCountriesService.execute(req.body, req.context)
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
  static async removeRestrictedStateProvider (req, res, next) {
    try {
      const result = await ProviderRemoveRestrictedStatesService.execute(req.body, req.context)
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
  static async restrictedCountryForGame (req, res, next) {
    try {
      const result = await GameRestrictCountriesService.execute(req.body, req.context)
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
  static async restrictedStateForGame (req, res, next) {
    try {
      const result = await GameRestrictStatesService.execute(req.body, req.context)
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
  static async restrictedCountryForProvider (req, res, next) {
    try {
      const result = await ProviderRestrictCountriesService.execute(req.body, req.context)
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
  static async restrictedStateForProvider (req, res, next) {
    try {
      const result = await ProviderRestrictStatesService.execute(req.body, req.context)
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
  static async reorderGames (req, res, next) {
    try {
      const result = await ReorderGameService.execute(req.body, req.context)
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
    static async reorderProvider (req, res, next) {
      try {
        const result = await ReorderProviderService.execute(req.body, req.context)
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
  static async toggle (req, res, next) {
    try {
      const result = await ToggleService.execute(req.body, req.context)
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
  static async editAggregator (req, res, next) {
    try {
      const result = await EditAggregatorService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {} }, req.context)
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
  static async editCategory (req, res, next) {
    try {
     const result = await EditCategoryService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {}}, req.context)
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
  static async editProvider (req, res, next) {
    try {
      const result = await EditProviderService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {} }, req.context)
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
  static async editGame (req, res, next) {
    try {
      const result = await EditGameService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : {}, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : {} }, req.context)
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
  static async toggleFeaturedGame (req, res, next) {
    try {
      const result = await ToggleFeaturedGameService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
