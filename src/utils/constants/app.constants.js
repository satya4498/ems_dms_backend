import path from 'path'

export const REPORT_TIME_PERIOD_FILTER = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  LAST_90_DAYS: 'last90days',
  MONTH_TO_DATE: 'monthtodate',
  CUSTOM: 'custom'
}

export const CACHE_KEYS = {
  PAGES: 'pages'
}

export const CACHE_STORE_PREFIXES = {
  BACKEND_CACHE: 'backend-cache:',
  SESSION: 'user-backend-session:',
  USER_BACKEND_CACHE: 'user-backend-cache:'
}

export const JWT_TOKEN_TYPES = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot_password'
}

export class S3FolderHierarchy {
  static #basePath = 'assets'

  static get common () {
    return path.join(this.#basePath, 'common')
  }
}

export const SUCCESS_MSG = {
  CREATE_SUCCESS: 'Record created successfully',
  DELETE_SUCCESS: 'Record deleted successfully',
  UPDATE_SUCCESS: 'Record updated successfully'
}
