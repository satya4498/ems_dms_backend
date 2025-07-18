import { StatusCodes } from 'http-status-codes'

const messages = {
  PLEASE_CHECK_REQUEST_DATA: 'PLEASE_CHECK_REQUEST_DATA',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RESPONSE_VALIDATION_FAILED: 'RESPONSE_VALIDATION_FAILED',
  SOCKET_PROVIDE_PROPER_ARGUMENTS: 'SOCKET_PROVIDE_PROPER_ARGUMENTS',
  ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED: 'ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED',
  LIMIT_DOES_NOT_EXISTS: 'LIMIT_DOES_NOT_EXISTS',
  DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING: 'DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING',
  DOCUMENTS_REQUIRED_BEFORE_PROCEEDING: 'ALL_MANDATORY_DOCUMENT_REQUIRES_BEFORE_PROCEEDING',
  INVALID_WALLET_ID: 'INVALID_WALLET_ID',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TAG_IS_NOT_ATTACHED: 'TAG_IS_NOT_ATTACHED',
  NOT_ENOUGH_AMOUNT: 'NOT_ENOUGH_AMOUNT',
  CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE: 'CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE',
  BANNER_NOT_FOUND: 'BANNER_NOT_FOUND',
  INVALID_IMAGE_NAME: 'INVALID_IMAGE_NAME',
  INVALID_SPORTSBOOK_ICON_TYPE: 'INVALID_SPORTSBOOK_ICON_TYPE',
  PAGE_NOT_FOUND: 'PAGE_NOT_FOUND',
  DOCUMENT_LABEL_EXISTS: 'DOCUMENT_LABEL_EXISTS',
  PAGE_SLUG_ALREADY_EXISTS: 'PAGE_SLUG_ALREADY_EXISTS',
  CANNOT_DEACTIVATE_DEFAULT_CURRENCY: 'CANNOT_DEACTIVATE_DEFAULT_CURRENCY',
  ADMIN_USER_NOT_FOUND: 'ADMIN_USER_NOT_FOUND',
  PARENT_ADMIN_NOT_FOUND: 'PARENT_ADMIN_NOT_FOUND',
  CHILD_ADMIN_USER_NOT_FOUND: 'CHILD_ADMIN_USER_NOT_FOUND',
  CURRENCY_ALREADY_EXISTS: 'CURRENCY_ALREADY_EXISTS',
  LANGUAGE_NOT_FOUND: 'LANGUAGE_NOT_FOUND',
  COMMENT_DOES_NOT_EXISTS: 'COMMENT_DOES_NOT_EXISTS',
  COUNTRY_NOT_FOUND: 'COUNTRY_NOT_FOUND',
  STATE_NOT_FOUND: 'STATE_NOT_FOUND',
  CURRENCY_NOT_FOUND: 'CURRENCY_NOT_FOUND',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
  SPORT_NOT_FOUND: 'SPORT_NOT_FOUND',
  LEAGUE_NOT_FOUND: 'LEAGUE_NOT_FOUND',
  LOCATION_NOT_FOUND: 'LOCATION_NOT_FOUND',
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  TAG_ALREADY_ATTACHED: 'TAG_ALREADY_ATTACHED',
  TAG_ALREADY_EXIST: 'TAG_ALREADY_EXIST',
  AGGREGATOR_NOT_FOUND: 'AGGREGATOR_NOT_FOUND',
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
  SUB_CATEGORY_NOT_FOUND: 'SUB_CATEGORY_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  USER_DOES_NOT_EXISTS: 'USER_DOES_NOT_EXISTS',
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  INVALID_ID: 'INVALID_ID',
  CATEGORY_ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS',
  SUB_CATEGORY_ALREADY_EXISTS: 'SUB_CATEGORY_ALREADY_EXISTS',
  BONUS_DOES_NOT_EXISTS: 'BONUS_DOES_NOT_EXISTS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USERNAME_ALREADY_EXISTS: 'USERNAME_ALREADY_EXISTS',
  FILE_FORMAT_NOT_SUPPORTED: 'FILE_FORMAT_NOT_SUPPORTED',
  INVALID_ROLE_ID: 'INVALID_ROLE_ID',
  INVALID_TYPE: 'INVALID_TYPE',
  DOCUMENT_ALREADY_APPROVED: 'DOCUMENT_ALREADY_APPROVED',
  DOCUMENTS_NOT_AVAILABLE: 'DOCUMENTS_NOT_AVAILABLE',
  DOCUMENT_LABEL_DOES_NOT_EXISTS: 'DOCUMENT_LABEL_DOES_NOT_EXISTS',
  EMAIL_TEMPLATE_NOT_FOUND: 'EMAIL_TEMPLATE_NOT_FOUND'
}

export const errorTypes = {
  RequestInputValidationErrorType: {
    name: 'RequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3001
  },
  ResponseValidationErrorType: {
    name: 'ResponseInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3002
  },
  SocketRequestInputValidationErrorType: {
    name: 'SocketRequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3003
  },
  SocketResponseValidationErrorType: {
    name: 'SocketResponseValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3004
  },
  InternalServerErrorType: {
    name: 'InternalServerError',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: true,
    description: messages.INTERNAL_SERVER_ERROR,
    errorCode: 3005
  },
  InvalidSocketArgumentErrorType: {
    name: 'InvalidSocketArgumentError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SOCKET_PROVIDE_PROPER_ARGUMENTS,
    errorCode: 3006
  },
  AuthenticationErrorType: {
    name: 'AuthenticationErrorType',
    statusCode: StatusCodes.UNAUTHORIZED,
    isOperational: true,
    description: messages.ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED,
    errorCode: 3007
  },
  NotEnoughPermissionErrorType: {
    name: 'NotEnoughPermissionErrorType',
    statusCode: StatusCodes.UNAUTHORIZED,
    isOperational: true,
    description: messages.NOT_ENOUGH_PERMISSION,
    erroCode: 3062
  },
  LimitDoesNotExistsErrorType: {
    name: 'LimitDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LIMIT_DOES_NOT_EXISTS,
    erroCode: 3008
  },
  DocumentRequiresApprovalBeforeProceedingErrorType: {
    name: 'DocumentRequiresApprovalBeforeProceedingErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING,
    erroCode: 3009
  },
  DocumentsRequiredBeforeProceedingErrorType: {
    name: 'DocumentsRequiredBeforeProceedingErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENTS_REQUIRED_BEFORE_PROCEEDING,
    erroCode: 3009
  },
  InvalidWalletIdErrorType: {
    name: 'InvalidWalletIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_WALLET_ID,
    erroCode: 3010
  },
  ServiceUnavailableErrorType: {
    name: 'ServiceUnavailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SERVICE_UNAVAILABLE,
    erroCode: 3011
  },
  TagIsNotAttachedErrorType: {
    name: 'TagIsNotAttachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_IS_NOT_ATTACHED,
    erroCode: 3012
  },
  NotEnoughAmountErrorType: {
    name: 'NotEnoughAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOT_ENOUGH_AMOUNT,
    erroCode: 3013
  },
  CannotDeleteDefaultEmailTemplateErrorType: {
    name: 'CannotDeleteDefaultEmailTemplateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE,
    erroCode: 3014
  },
  BannerNotFoundErrorType: {
    name: 'BannerNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BANNER_NOT_FOUND,
    erroCode: 3015
  },
  InvalidImageNameErrorType: {
    name: 'InvalidImageNameErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_IMAGE_NAME,
    erroCode: 3016
  },
  InvalidSportsbookIconTypeErrorType: {
    name: 'InvalidSportsbookIconTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_SPORTSBOOK_ICON_TYPE,
    erroCode: 3017
  },
  PageNotFoundErrorType: {
    name: 'PageNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAGE_NOT_FOUND,
    erroCode: 3018
  },
  DocumentLabelExistsErrorType: {
    name: 'DocumentLabelExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_LABEL_EXISTS,
    erroCode: 3019
  },
  PageSlugAlreadyExistsErrorType: {
    name: 'PageSlugAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAGE_SLUG_ALREADY_EXISTS,
    erroCode: 3020
  },
  CannotDeactivateDefaultCurrencyErrorType: {
    name: 'CannotDeactivateDefaultCurrencyErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CANNOT_DEACTIVATE_DEFAULT_CURRENCY,
    erroCode: 3021
  },
  AdminUserNotFoundErrorType: {
    name: 'AdminUserNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ADMIN_USER_NOT_FOUND,
    erroCode: 3022
  },
  ParentAdminNotFoundErrorType: {
    name: 'ParentAdminNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PARENT_ADMIN_NOT_FOUND,
    erroCode: 3023
  },
  ChildAdminUserNotFoundErrorType: {
    name: 'ChildAdminUserNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CHILD_ADMIN_USER_NOT_FOUND,
    erroCode: 3024
  },
  CurrencyAlreadyExistsErrorType: {
    name: 'CurrencyAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CURRENCY_ALREADY_EXISTS,
    erroCode: 3025
  },
  LanguageNotFoundErrorType: {
    name: 'LanguageNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LANGUAGE_NOT_FOUND,
    erroCode: 3026
  },
  CommentDoesNotExistsErrorType: {
    name: 'CommentDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.COMMENT_DOES_NOT_EXISTS,
    erroCode: 3027
  },
  CountryNotFoundErrorType: {
    name: 'CountryNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.COUNTRY_NOT_FOUND,
    erroCode: 3028
  },
  StateNotFoundErrorType: {
    name: 'StateNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.STATE_NOT_FOUND,
    erroCode: 3028
  },
  CurrencyNotFoundErrorType: {
    name: 'CurrencyNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CURRENCY_NOT_FOUND,
    erroCode: 3029
  },
  InvalidPasswordErrorType: {
    name: 'InvalidPasswordErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PASSWORD,
    erroCode: 3030
  },
  PasswordMismatchErrorType: {
    name: 'PasswordMismatchErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PASSWORD_MISMATCH,
    erroCode: 3031
  },
  SportNotFoundErrorType: {
    name: 'SportNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SPORT_NOT_FOUND,
    erroCode: 3032
  },
  LeagueNotFoundErrorType: {
    name: 'LeagueNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LEAGUE_NOT_FOUND,
    erroCode: 3033
  },
  LocationNotFoundErrorType: {
    name: 'LocationNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOCATION_NOT_FOUND,
    erroCode: 3034
  },
  EventNotFoundErrorType: {
    name: 'EventNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EVENT_NOT_FOUND,
    erroCode: 3035
  },
  TagAlreadyAttachedErrorType: {
    name: 'TagAlreadyAttachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_ALREADY_ATTACHED,
    erroCode: 3036
  },
  TagAlreadyExistErrorType: {
    name: 'TagAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_ALREADY_EXIST,
    erroCode: 3037
  },
  AggregatorNotFoundErrorType: {
    name: 'AggregatorNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.AGGREGATOR_NOT_FOUND,
    erroCode: 3038
  },
  ProviderNotFoundErrorType: {
    name: 'ProviderNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROVIDER_NOT_FOUND,
    erroCode: 3039
  },
  CategoryNotFoundErrorType: {
    name: 'CategoryNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CATEGORY_NOT_FOUND,
    erroCode: 3041
  },
  UserDoesNotExistsErrorType: {
    name: 'UserDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_DOES_NOT_EXISTS,
    erroCode: 3042
  },
  GameNotFoundErrorType: {
    name: 'GameNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.GAME_NOT_FOUND,
    erroCode: 3045
  },
  InvalidIdErrorType: {
    name: 'InvalidIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_ID,
    erroCode: 3046
  },
  CategoryAlreadyExistsErrorType: {
    name: 'CategoryAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CATEGORY_ALREADY_EXISTS,
    erroCode: 3047
  },
  SubCategoryAlreadyExistsErrorType: {
    name: 'SubCategoryAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SUB_CATEGORY_ALREADY_EXISTS,
    erroCode: 3048
  },
  InvalidTokenErrorType: {
    name: 'InvalidTokenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TOKEN,
    erroCode: 3049
  },
  EmailAlreadyExistsErrorType: {
    name: 'EmailAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_ALREADY_EXISTS,
    erroCode: 3050
  },
  EmailNotVerifiedErrorType: {
    name: 'EmailNotVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_NOT_VERIFIED,
    erroCode: 3051
  },
  UsernameAlreadyExistsErrorType: {
    name: 'UsernameAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USERNAME_ALREADY_EXISTS,
    erroCode: 3052
  },
  FileFormatNotSupportedErrorType: {
    name: 'FileFormatNotSupportedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FILE_FORMAT_NOT_SUPPORTED,
    erroCode: 3053
  },
  InvalidRoleIdErrorType: {
    name: 'InvalidRoleIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_ROLE_ID,
    erroCode: 3054
  },
  InvalidTypeErrorType: {
    name: 'InvalidTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TYPE,
    erroCode: 3055
  }
}
