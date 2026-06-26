
export const PERMISSION_LEVELS_INVERTED = {
  R: 'read',
  C: 'create',
  U: 'update',
  D: 'delete',
  I: 'issue',
  L: 'limit',
  TS: 'toggle_status',
  VE: 'verify_email',
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
  reset_password: 'RP'
}

export const APPLICATION_PERMISSION = {
  kyc: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete]
}

/** @type {APPLICATION_PERMISSION} */
export const resources = Object.keys(APPLICATION_PERMISSION).reduce((prev, key) => {
  prev[key] = bindLevels(key, APPLICATION_PERMISSION[key])
  return prev
}, {})
