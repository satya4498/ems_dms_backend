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
  EMAIL_TEMPLATE_NOT_FOUND: 'EMAIL_TEMPLATE_NOT_FOUND',
  NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE: 'NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE',
  MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY: 'MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY',
  NOT_ENOUGH_PERMISSION: 'NOT_ENOUGH_PERMISSION',
  SUPER_ADMIN_ROLE_ASSIGNMENT_ERROR: 'SUPER_ADMIN_ROLE_CAN_NOT_BE_ASSIGNED_TO_OTHER_ADMIN_USERS',
  CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT: 'CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT',
  OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME: 'OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME',
  MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS: 'MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS',
  DAILY_LIMIT: 'DAILY_LIMIT_CANNOT_EXCEED_THE_WEEKLY_OR_MONTHLY_LIMIT',
  MONTHLY_LIMIT: 'MONTHLY_LIMIT_CANNOT_BE_LOWER_THAN_THE_DAILY_OR_WEEKLY_LIMIT',
  WEEKLY_LIMIT: 'WEEKLY_LIMIT_CANNOT_EXCEED_THE_MONTHLY_LIMIT_OR_BE_LOWER_THAN_THE_MONTHLY_LIMIT',
  INVALID_CURRENCY_DETAILES: 'INVALID_CURRENCY_DETAILES ',
  FREESPIN_QUANTITY_REQUIRED: 'FREESPIN_QUANTITY_REQUIRED',
  ACTIVE_BONUS_EXISTS: 'ACTIVE_BONUS_EXISTS',
  USER_BONUS_ALREADY_EXISTS: 'USER_BONUS_ALREADY_EXISTS',
  WAGERING_TEMPLATE_DOES_NOT_EXIST: 'WAGERING_TEMPLATE_DOES_NOT_EXIST',
  WAGERING_TEMPLATE_ALREADY_EXIST: 'WAGERING_TEMPLATE_ALREADY_EXIST',
  INVALID_DATES: 'INVALID_DATES',
  INVALID_PRIZE: 'INVALID_PRIZE',
  TOURNAMENT_DOES_NOT_EXISTS: 'TOURNAMENT_DOES_NOT_EXISTS',
  TOURNAMENT_SETTLED_OR_CANCELLED: 'TOURNAMENT_SETTLED_OR_CANCELLED',
  BONUS_UNDER_CLAIM: 'BONUS_UNDER_CLAIM',
  AMOUNT_TO_WAGER_EXISTS: 'AMOUNT_TO_WAGER_EXISTS',
  TOURNAMENT_EXISTS: 'TOURNAMENT_EXISTS',
  TOURNAMENT_PRIZE_DOES_NOT_EXISTS: 'TOURNAMENT_PRIZE_DOES_NOT_EXISTS',
  TOURNAMENT_USER_DOES_NOT_EXISTS: 'TOURNAMENT_USER_DOES_NOT_EXISTS',
  PAYMENT_PROVIDER_NOT_FOUND: 'PAYMENT_PROVIDER_NOT_FOUND',
  NOTIFICATION_SUBSCRIPTION_NOT_EXIST: 'NOTIFICATION_SUBSCRIPTION_NOT_EXIST',
  NOTIFICATION_NOT_EXIST: 'NOTIFICATION_NOT_EXIST',
  REFERRAL_DOES_NOT_EXISTS: 'REFERRAL_DOES_NOT_EXISTS',
  INVALID_PURPOSE: 'INVALID_PURPOSE',
  PACKAGE_NOT_FOUND: 'PACKAGE_NOT_FOUND',
  PACKAGE_ALREADY_EXISTS: 'PACKAGE_ALREADY_EXISTS',
  POSTAL_CODE_NOT_AVAILABLE_TRY_LATER: 'POSTAL_CODE_NOT_AVAILABLE_TRY_LATER',
  AMO_ENTRY_ALREADY_SETTLED: 'AMO_ENTRY_ALREADY_SETTLED',
  INVALID_REDIRECTION_URL: 'INVALID_REDIRECTION_URL',
  PROVIDER_ALREADY_EXIST: 'PROVIDER_ALREADY_EXIST',
  SOME_GAME_NOT_FOUND: 'SOME_GAME_NOT_FOUND',
  GAMES_ALREADY_EXIST: 'GAMES_ALREADY_EXIST',
  REFERRAL_BONUS_ALREADY_EXIST: 'REFERRAL_BONUS_ALREADY_EXIST',
  COUPON_CODE_BONUS_ALREADY_EXIST: 'COUPON_CODE_BONUS_ALREADY_EXIST',
  PROMO_CODE_BONUS_ALREADY_EXIST: 'PROMO_CODE_BONUS_ALREADY_EXIST',
  NO_PENDING_WITHDRAWAL: 'NO_PENDING_WITHDRAWAL',
  LOYALTY_LEVEL_NAME_OR_ID_ALREADY_EXIST: 'LOYALTY_LEVEL_NAME_OR_ID_ALREADY_EXIST',
  NEW_LEVEL_MUST_BE_GREATER_THAN_PREVIOUS: 'NEW_LEVEL_MUST_BE_GREATER_THAN_PREVIOUS',
  NEW_LEVEL_MUST_BE_LESS_THAN_NEXT: 'NEW_LEVEL_MUST_BE_LESS_THAN_NEXT',
  NEW_LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_PREVIOUS: 'NEW_LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_PREVIOUS',
  LOYALTY_LEVEL_NOT_FOUND: 'LOYALTY_LEVEL_NOT_FOUND',
  LOYALTY_LEVEL_WITH_THAT_LEVEL_UP_POINTS_ALREADY_EXIST: 'LOYALTY_LEVEL_WITH_THAT_LEVEL_UP_POINTS_ALREADY_EXIST',
  LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_LEVELUP_POINTS: 'LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_LEVELUP_POINTS',
  LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_GREATER_THAN_PREVIOUS_LEVEL: 'LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_GREATER_THAN_PREVIOUS_LEVEL',
  LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_NEXT_LEVEL: 'LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_NEXT_LEVEL',
  LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_THE_LOYALTY_BONUS_AMOUNT: 'LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_THE_LOYALTY_BONUS_AMOUNT',
  DAYS_TO_CLEAR_SHOULD_BE_GREATER_THAN_ZERO: 'DAYS_TO_CLEAR_SHOULD_BE_GREATER_THAN_ZERO',
  NO_USERS_PRESENT_IN_SEGMENT: 'NO_USERS_PRESENT_IN_SEGMENT',
  PACKAGES_ALREADY_PRESENT_OTHER_BONUS: 'PACKAGES_ALREADY_PRESENT_OTHER_BONUS',
  TOURNAMENT_LIMIT_EXCEEDED: 'TOURNAMENT_LIMIT_EXCEEDED',
  ALREADY_TASK_WITH_SAME_CONDITION_EXIST: 'ALREADY_TASK_WITH_SAME_CONDITION_EXIST',
  TASK_WITH_SAME_GAME_AND_MIN_BET_EXIST: 'TASK_WITH_SAME_GAME_AND_MIN_BET_EXIST',
  GAMIFICATION_DOES_NOT_EXIST: 'GAMIFICATION_DOES_NOT_EXIST'
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
  },
  DocumentAlreadyApprovedErrorType: {
    name: 'DocumentAlreadyApprovedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_ALREADY_APPROVED,
    erroCode: 3056
  },
  DocumentsNotAvailableErrorType: {
    name: 'DocumentsNotAvailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENTS_NOT_AVAILABLE,
    erroCode: 3057
  },
  DocumentLabelDoesNotExistsErrorType: {
    name: 'DocumentLabelDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_LABEL_DOES_NOT_EXISTS,
    erroCode: 3058
  },
  EmailTemplateNotFoundErrorType: {
    name: 'EmailTemplateNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_TEMPLATE_NOT_FOUND,
    erroCode: 3059
  },
  NoExistingTemaplateFoundForThisEventTypeErrorType: {
    name: 'NoExistingTemaplateFoundForThisEventTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE,
    erroCode: 3060
  },
  MoveAllTheGamesToAnotherCategoryErrorType: {
    name: 'MoveAllTheGamesToAnotherCategoryErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY,
    erroCode: 3061
  },
  SuperAdminRoleAssignmentErrorErrorType: {
    name: 'SuperAdminRoleAssignmentErrorErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SUPER_ADMIN_ROLE_ASSIGNMENT_ERROR,
    erroCode: 3063
  },
  ChildRoleCannotBeSameAsParentErrorType: {
    name: 'ChildRoleCannotBeSameAsParentErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT,
    erroCode: 3064
  },
  OldPasswordAndNewPassowrdMustNotBeSameErrorType: {
    name: 'OldPasswordAndNewPassowrdMustNotBeSameErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME,
    erroCode: 3065
  },
  MaxOddsShouldBeGreaterThenMinOddsErrorType: {
    name: 'MaxOddsShouldBeGreaterThenMinOddsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS,
    erroCode: 3066
  },
  DailyLimitErrorType: {
    name: 'DailyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DAILY_LIMIT,
    erroCode: 3067
  },
  MonthlyLimitErrorType: {
    name: 'MonthlyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MONTHLY_LIMIT,
    erroCode: 3068
  },
  WeeklyLimitErrorType: {
    name: 'WeeklyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WEEKLY_LIMIT,
    erroCode: 3069
  },
  BonusDoesNotExistsErrorType: {
    name: 'BonusDoesNotExistsErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: messages.BONUS_DOES_NOT_EXISTS,
    erroCode: 3070
  },
  InvalidCurrencyDetailsErrorType: {
    name: 'InvalidCurrencyDetailsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_CURRENCY_DETAILES,
    errorCode: 3071
  },
  FreeSpinQuantityRequiredErrorType: {
    name: 'FreeSpinQuantityRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FREESPIN_QUANTITY_REQUIRED,
    errorCode: 3072
  },
  ActiveBonusExistsErrorType: {
    name: 'ActiveBonusExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACTIVE_BONUS_EXISTS,
    errorCode: 3073
  },
  WageringTemplateDoesNotExistsErrorType: {
    name: 'WageringTemplateDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WAGERING_TEMPLATE_DOES_NOT_EXIST,
    errorCode: 3074
  },
  WageringTemplateExistsErrorType: {
    name: 'WageringTemplateExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WAGERING_TEMPLATE_ALREADY_EXIST,
    errorCode: 3075
  },
  InvalidDateErrorType: {
    name: 'InvalidDateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_DATES,
    errorCode: 3076
  },
  InvalidPrizeErrorType: {
    name: 'InvalidPrizeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PRIZE,
    errorCode: 3077
  },
  TournamentDoesNotExistErrorType: {
    name: 'TournamentDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_DOES_NOT_EXISTS,
    errorCode: 3078
  },
  UserBonusAlreadyExistErrorType: {
    name: 'UserBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_BONUS_ALREADY_EXISTS,
    errorCode: 3079
  },
  TournamentSettledOrCancelledErrorType: {
    name: 'TournamentSettledOrCancelledErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_SETTLED_OR_CANCELLED,
    errorCode: 3079
  },
  BonusUnderClaimExistsErrorType: {
    name: 'BonusUnderClaimExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_UNDER_CLAIM,
    errorCode: 3080
  },
  AmountToWagerExistsErrorType: {
    name: 'AmountToWagerExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_UNDER_CLAIM,
    errorCode: 3081
  },
  TournamentExistsErrorType: {
    name: 'TournamentExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_EXISTS,
    errorCode: 3082
  },
  TournamentPrizeNotExistErrorType: {
    name: 'TournamentPrizeNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_PRIZE_DOES_NOT_EXISTS,
    errorCode: 3083
  },
  TournamentUserNotExistErrorType: {
    name: 'TournamentUserNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_USER_DOES_NOT_EXISTS,
    errorCode: 3083
  },
  PaymentProviderNotExistErrorType: {
    name: 'PaymentProviderNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_USER_DOES_NOT_EXISTS,
    errorCode: 3084
  },
  NotificationSubscriptionNotExistErrorType: {
    name: 'NotificationSubscriptionNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOTIFICATION_SUBSCRIPTION_NOT_EXIST,
    errorCode: 3085
  },
  NotificationNotExistErrorType: {
    name: 'NotificationNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOTIFICATION_NOT_EXIST,
    errorCode: 3086
  },
  ReferralNotExistErrorType: {
    name: 'ReferralNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.REFERRAL_DOES_NOT_EXISTS,
    errorCode: 3085
  },
  InvalidPurposeErrorType: {
    name: 'InvalidPurposeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PURPOSE,
    errorCode: 3084
  },
  ThisGroupNameAlreadyExistsErrorType: {
    name: 'ThisGroupNameAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group name already exist',
    errorCode: 3085
  },
  ThisCriteriaDoesNotExistsErrorType: {
    name: 'ThisCriteriaDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid Criteria',
    errorCode: 3086
  },
  GlobalGroupExistErrorType: {
    name: 'GlobalGroupExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Global group already exist',
    errorCode: 3087
  },
  InvalidChatGroupErrorType: {
    name: 'InvalidChatGroupErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not exist',
    errorCode: 3088
  },
  ChatRainAlreadyActiveErrorType: {
    name: 'ChatRainAlreadyActiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat Rain Already Exist',
    errorCode: 3089
  },
  ThisChatRuleDoesNotExistErrorType: {
    name: 'ThisChatRuleDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'ChatRule not exist',
    errorCode: 3090
  },
  OffensiveWordAlreadyExistErrorType: {
    name: 'OffensiveWordAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This word already exist',
    errorCode: 3091
  },
  OffensiveWordNotFoundErrorType: {
    name: 'OffensiveWordNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This word not exist',
    errorCode: 3092
  },
  ThisGroupDoesNotExistsErrorType: {
    name: 'ThisGroupDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not exist',
    errorCode: 3093
  },
  CredentialsAlreadyExistsErrorType: {
    name: 'CredentialsAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Credentials already exist',
    errorCode: 3093
  },
  EmailAlreadyVerifiedErrorType: {
    name: 'EmailAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'EMAIL_ALREADY_VERIFIED',
    errorCode: 3094
  },
  JoiningBonusAlreadyExistErrorType: {
    name: 'JoiningBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'JOINING_BONUS_ALREADY_EXIST',
    errorCode: 3094
  },
  PackageAlreadyExistsErrorType: {
    name: 'PackageAlreadyExistsErrorType',
    statusCode: StatusCodes.CONFLICT,
    isOperational: true,
    description: messages.PACKAGE_ALREADY_EXISTS,
    errorCode: 3060
  },
  PackageNotFoundErrorType: {
    name: 'PackageNotFoundErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: messages.PACKAGE_NOT_FOUND,
    errorCode: 3061
  },
  PostalCodeInactiveErrorType: {
    name: 'PostalCodeInactiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.POSTAL_CODE_NOT_AVAILABLE_TRY_LATER,
    errorCode: 3095
  },
  AmoEntryAlreadySettleErrorType: {
    name: 'AmoEntryAlreadySettleErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.AMO_ENTRY_ALREADY_SETTLED,
    errorCode: 3096
  },
  InvalidRedirectionUrl: {
    name: 'InvalidRedirectionUrl',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_REDIRECTION_URL,
    erroCode: 3097
  },
  SomeGameNotFoundErrorType: {
    name: 'SomeGameNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SOME_GAME_NOT_FOUND,
    erroCode: 3097
  },
  ProviderAlreadyExistsErrorType: {
    name: 'ProviderAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROVIDER_ALREADY_EXIST,
    erroCode: 3098
  },
  GamesAlreadyExistsErrorType: {
    name: 'GamesAlreadyExistsErrorType',
    statusCode: StatusCodes.CONFLICT,
    isOperational: true,
    description: messages.GAMES_ALREADY_EXIST,
    errorCode: 3099
  },
  SegmentNameAlreadyExistsErrorType: {
    name: 'SegmentNameAlreadyExists',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Segment name already exists',
    errorCode: 3096
  },
  SegmentDoesNotExistsErrorType: {
    name: 'SegmentDoesNotExists',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Segment does not exists',
    errorCode: 3097
  },
  InvalidSegmentInputTypeError: {
    name: 'InvalidSegmentInputTypeError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid segment input type',
    errorCode: 3098
  },
  ReferralBonusAlreadyExistErrorType: {
    name: 'ReferralBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.REFERRAL_BONUS_ALREADY_EXIST,
    errorCode: 3099
  },
  CouponCodeBonusAlreadyExistErrorType: {
    name: 'CouponCodeBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.COUPON_CODE_BONUS_ALREADY_EXIST,
    errorCode: 3100
  },
  PromoCodeBonusAlreadyExistErrorType: {
    name: 'PromoCodeBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROMO_CODE_BONUS_ALREADY_EXIST,
    errorCode: 3101
  },
  NoPendingWithdrawalErrorType: {
    name: 'NoPendingWithdrawalErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NO_PENDING_WITHDRAWAL,
    errorCode: 3102
  },
  LoyaltyBonusAmountLessThanLevelUpPointsError: {
    name: 'LoyaltyBonusAmountLessThanLevelUpPointsError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_LEVELUP_POINTS,
    errorCode: 3103
  },
  LoyaltyBonusAmountGreaterThanPreviousLevelError: {
    name: 'LoyaltyBonusAmountGreaterThanPreviousLevelError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_GREATER_THAN_PREVIOUS_LEVEL,
    errorCode: 3104
  },
  LoyaltyBonusAmountLessThanNextLevelError: {
    name: 'LoyaltyBonusAmountLessThanNextLevelError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_SC_BONUS_AMOUNT_SHOULD_BE_LESS_THAN_NEXT_LEVEL,
    errorCode: 3105
  },
  LevelUpPointsMustBeGreaterThanLoyaltyBonusAmountError: {
    name: 'LevelUpPointsMustBeGreaterThanLoyaltyBonusAmount',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_THE_LOYALTY_BONUS_AMOUNT,
    errorCode: 3106
  },
  AlreadyLoyaltyLevelWithThatNameOrIdExist: {
    name: 'AlreadyLoyaltyLevelWithThatNameOrIdExist',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_LEVEL_NAME_OR_ID_ALREADY_EXIST,
    errorCode: 3107
  },
  NewLevelMustBeGreaterThanPrevious: {
    name: 'NewLevelMustBeGreaterThanPrevious',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NEW_LEVEL_MUST_BE_GREATER_THAN_PREVIOUS,
    errorCode: 3108
  },
  NewLevelUpPointsMustBeLessThanNext: {
    name: 'NewLevelUpPointsMustBeLessThanNext',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NEW_LEVEL_MUST_BE_LESS_THAN_NEXT,
    errorCode: 3109
  },
  NewLevelUpPointsMustBeGreaterThanPrevious: {
    name: 'NewLevelUpPointsMustBeGreaterThanPrevious',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NEW_LEVEL_UP_POINTS_MUST_BE_GREATER_THAN_PREVIOUS,
    errorCode: 3110
  },
  LoyaltyLevelNotFound: {
    name: 'LoyaltyLevelNotFound',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_LEVEL_NOT_FOUND,
    errorCode: 3111
  },
  LoyaltyLevelWithThatLevelUpPointsExists: {
    name: 'LoyaltyLevelWithThatLevelUpPointsExists',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOYALTY_LEVEL_WITH_THAT_LEVEL_UP_POINTS_ALREADY_EXIST,
    errorCode: 4003
  },
  DaysToClearShouldBeGreaterThanZero: {
    name: 'DaysToClearShouldBeGreaterThanZero',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DAYS_TO_CLEAR_SHOULD_BE_GREATER_THAN_ZERO,
    errorCode: 4004
  },
  NoUsersExistsErrorType: {
    name: 'NoUsersExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NO_USERS_PRESENT_IN_SEGMENT,
    errorCode: 4004
  },
  PackagesAlreadyAddedInOtherBonus: {
    name: 'PackagesAlreadyAddedInOtherBonus',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PACKAGES_ALREADY_PRESENT_OTHER_BONUS,
    errorCode: 4005
  },
  TournamentLimitExceededErrorType: {
    name: 'TournamentLimitExceededErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_LIMIT_EXCEEDED,
    errorCode: 4006
  },
  AlreadyTaskWithSameConditionExist: {
    name: 'AlreadyTaskWithSameConditionExist',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ALREADY_TASK_WITH_SAME_CONDITION_EXIST,
    errorCode: 4007
  },
  DuplicateTaskGameCombinationError: {
    name: 'DuplicateTaskGameCombinationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TASK_WITH_SAME_GAME_AND_MIN_BET_EXIST,
    errorCode: 4008
  },
  GamificationDoesNotExistError: {
    ame: 'GamificationDoesNotExistError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.GAMIFICATION_DOES_NOT_EXIST,
    errorCode: 4008
  }

}
