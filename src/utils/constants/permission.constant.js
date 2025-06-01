
export const PERMISSION_LEVELS_INVERTED = {
  R: 'read',
  C: 'create',
  U: 'update',
  D: 'delete',
  I: 'issue',
  L: 'limit',
  TS: 'toggle_status',
  VE: 'verify_email',
  MM: 'manage_money',
  RP: 'reset_password'
}

/**
 * Binds resource to permission levels.
 * @param {string} resource - The resource name.
 * @param {Array<string>} permissions - Array of permission levels.
 * @returns {PERMISSION_LEVELS} - Object mapping permission levels to resource-specific keys.
 */
function bindLevels (resource, permissions = Object.keys(PERMISSION_LEVELS)) {
  return permissions.reduce((prev, level) => {
    prev[PERMISSION_LEVELS_INVERTED[level]] = `${resource}:${level}`
    return prev
  }, {})
}

const PERMISSION_LEVELS = {
  read: 'R',
  create: 'C',
  update: 'U',
  delete: 'D',
  issue: 'I',
  limit: 'L',
  toggle_status: 'TS',
  verify_email: 'VE',
  manage_money: 'MM',
  reset_password: 'RP'
}

export const APPLICATION_PERMISSION = {
  kyc: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  page: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  admin: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.verify_email, PERMISSION_LEVELS.reset_password],
  bonus: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.issue],
  banner: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  gallery: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  limits: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  player: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.verify_email, PERMISSION_LEVELS.toggle_status],
  comment: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  coin: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  kpiReport: [PERMISSION_LEVELS.read],
  demography: [PERMISSION_LEVELS.read],
  gameReport: [PERMISSION_LEVELS.read],
  kpiSummaryReport: [PERMISSION_LEVELS.read],
  livePlayerDetail: [PERMISSION_LEVELS.read],
  casinoManagement: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  applicationSetting: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  tournamentManagement: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  referral: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  disputeManagement: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  redeem: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.create],
  package: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.create],
  segmentation: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.create, PERMISSION_LEVELS.issue],
  notification: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create],
  amoe: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update],
  reportLedger: [PERMISSION_LEVELS.read],
  reportTransaction: [PERMISSION_LEVELS.read],
  reportCasinoTransaction: [PERMISSION_LEVELS.read],
  reportPlayerPerformance: [PERMISSION_LEVELS.read],
  state: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.update],
  segment: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  gamification: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status]
}

/** @type {APPLICATION_PERMISSION} */
export const resources = Object.keys(APPLICATION_PERMISSION).reduce((prev, key) => {
  prev[key] = bindLevels(key, APPLICATION_PERMISSION[key])
  return prev
}, {})
