
export const SQL_OPERATORS = {
    eq: '=',
    ne: '!=',
    lt: '<',
    lte: '<=',
    gt: '>',
    gte: '>=',
    like: 'LIKE',
    notLike: 'NOT LIKE',
    in: 'IN',
    notIn: 'NOT IN',
    between: 'BETWEEN',
    notBetween: 'NOT BETWEEN',
    exists: 'EXISTS',
    notExists: 'NOT EXISTS',
    isNull: 'IS NULL',
    isNotNull: 'IS NOT NULL',
};
export const OPERATORS = {
    eq: 'eq',
    ne: 'ne',
    lt: 'lt',
    lte: 'lte',
    gt: 'gt',
    gte: 'gte',
    in: 'in',
    notIn: 'notIn',
    between: 'between',
    notBetween: 'notBetween',
    exists: 'exists',
    notExists: 'notExists',
    isNull: 'isNull',
    isNotNull: 'isNotNull',
    like: 'like',
    notLike: 'notLike',
}

export const SEGMENT_DESCRIPTIONS = {
  redeemAmount: {
    eq: "Users who redeemed exactly value.",
    ne: "Users who redeemed an amount different from value.",
    gt: "Users who redeemed more than value.",
    gte: "Users who redeemed at least value.",
    lt: "Users who redeemed less than value.",
    lte: "Users who redeemed at most value.",
    between: "Users who redeemed between value1 and value2.",
    notBetween: "Users who did not redeem between value1 and value2.",
  },

  purchaseAmount: {
    eq: "Users who purchased exactly value.",
    ne: "Users who purchased an amount different from value.",
    gt: "Users who purchased more than value.",
    gte: "Users who purchased at least value.",
    lt: "Users who purchased less than value.",
    lte: "Users who purchased at most value.",
    between: "Users who purchased between value1 and value2.",
    notBetween: "Users who did not purchase between value1 and value2.",
  },

  wageringAmount: {
    eq: "Users who wagered exactly value.",
    ne: "Users who wagered an amount different from value.",
    gt: "Users who wagered more than value.",
    gte: "Users who wagered at least value.",
    lt: "Users who wagered less than value.",
    lte: "Users who wagered at most value.",
    between: "Users who wagered between value1 and value2.",
    notBetween: "Users who did not wager between value1 and value2.",
  },

  wageringCount: {
    eq: "Users who placed exactly value bets.",
    ne: "Users who placed a different number of bets than value.",
    gt: "Users who placed more than value bets.",
    gte: "Users who placed at least value bets.",
    lt: "Users who placed less than value bets.",
    lte: "Users who placed at most value bets.",
    between: "Users who placed between value1 and value2 bets.",
    notBetween: "Users who did not place between value1 and value2 bets.",
  },

  playersStatus: {
    eq: "Users with status value.",
    ne: "Users without status value.",
  },

  signup: {
    eq: "Users who signed up on value.",
    ne: "Users who did not sign up on value.",
    gt: "Users who signed up after value.",
    gte: "Users who signed up on or after value.",
    lt: "Users who signed up before value.",
    lte: "Users who signed up on or before value.",
    between: "Users who signed up between value2 and value1.",
    notBetween: "Users who did not sign up between value2 and value1.",
  },

  age: {
    eq: "Users exactly value years old.",
    ne: "Users not value years old.",
    gt: "Users older than value.",
    gte: "Users value years or older.",
    lt: "Users younger than value.",
    lte: "Users value years or younger.",
    between: "Users between value1 and value2 years old.",
    notBetween: "Users not between value1 and value2 years old.",
  },

  gender: {
    eq: "Users who are value.",
    ne: "Users who are not value.",
  },

  grossGamingRevenue: {
    eq: "Users with a total gross gaming revenue of value.",
    ne: "Users with a total gross gaming revenue different from value.",
    gt: "Users with a total gross gaming revenue greater than value.",
    gte: "Users with a total gross gaming revenue of at least value.",
    lt: "Users with a total gross gaming revenue less than value.",
    lte: "Users with a total gross gaming revenue of at most value.",
    between: "Users with a total gross gaming revenue between value1 and value2.",
    notBetween: "Users with a total gross gaming revenue not between value1 and value2.",
  },

  winAmount: {
    eq: "Users who won exactly value.",
    ne: "Users who won a different amount than value.",
    gt: "Users who won more than value.",
    gte: "Users who won at least value.",
    lt: "Users who won less than value.",
    lte: "Users who won at most value.",
    between: "Users who won between value1 and value2.",
    notBetween: "Users who did not win between value1 and value2.",
  },

  redeemCount: {
    eq: "Users who made exactly value redeems.",
    ne: "Users who made a different number of redeems than value.",
    gt: "Users who made more than value redeems.",
    gte: "Users who made at least value redeems.",
    lt: "Users who made fewer than value redeems.",
    lte: "Users who made at most value redeems.",
    between: "Users who made between value1 and value2 redeems.",
    notBetween: "Users who did not make between value1 and value2 redeems.",
  },
  
  purchaseCount: {
    eq: "Users who made exactly value purchases.",
    ne: "Users who made a different number of purchases than value.",
    gt: "Users who made more than value purchases.",
    gte: "Users who made at least value purchases.",
    lt: "Users who made fewer than value purchases.",
    lte: "Users who made at most value purchases.",
    between: "Users who made between value1 and value2 purchases.",
    notBetween: "Users who did not make between value1 and value2 purchases.",
  },
  

  lastLogin: {
    eq: "Users who logged in on value.",
    ne: "Users who did not log in on value.",
    gt: "Users who logged in after value.",
    gte: "Users who logged in on or after value.",
    lt: "Users who logged in before value.",
    lte: "Users who logged in on or before value.",
    between: "Users who logged in between value2 and value1.",
    notBetween: "Users who did not log in between value2 and value1.",
  },

  lastPlayed: {
    eq: "Users who played on value.",
    ne: "Users who did not play on value.",
    gt: "Users who played after value.",
    gte: "Users who played on or after value.",
    lt: "Users who played before value.",
    lte: "Users who played on or before value.",
    between: "Users who played between value2 and value1.",
    notBetween: "Users who did not play between value2 and value1.",
  },

  kycStatus: {
    eq: "Users with KYC status value.",
    ne: "Users without KYC status value.",
  },
};
export const SEGMENT_CATEGORIES = {
  redeemAmount: { value: 'INT', table: 'ledgers', filterColumn: 'amount', queryType: 'aggregate', purpose: 'Redeem', lType: 'credit', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.redeemAmount },

  purchaseAmount: { value: 'INT', table: 'ledgers', filterColumn: 'amount', queryType: 'aggregate', purpose: 'Purchase', lType: 'debit', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.purchaseAmount },

  wageringAmount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'wager', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.wageringAmount },

  wageringCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'wagering_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.wageringCount },

  playersStatus: { value: 'BOOLEAN', table: 'users', filterColumn: 'users.is_active', queryType: 'single',lType:'player_status', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.playersStatus },

  signup: { value: 'INT', table: 'users', filterColumn: 'users.created_at', queryType: 'aggregate', lType: 'signup', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.signup },

  age: { value: 'INT', table: 'users', filterColumn: 'users.date_of_birth', queryType: 'single', lType: 'age', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.age },

  gender: { value: 'STRING', table: 'users', filterColumn: 'users.gender', queryType: 'single', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.gender },

  grossGamingRevenue: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', lType: 'gross_gaming_revenue', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.grossGamingRevenue },

  winAmount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoWin', lType: 'winning_amount', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.winAmount },

  redeemCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'Redeem', lType: 'redeem_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.redeemCount },

  purchaseCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'Purchase', lType: 'purchase_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.purchaseCount },

  lastLogin: { value: 'INT', table: 'users', filterColumn: 'users.logged_in_at', queryType: 'aggregate', lType: 'last_login', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.lastLogin },

  lastPlayed: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.created_at', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'last_played', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.lastPlayed },

  // country: { value: 'INT', table: 'users', filterColumn: 'users.country_id', queryType: 'single', lType: 'country', operators: ['eq', 'ne'] },

  kycStatus: { value: 'BOOLEAN', table: 'users', filterColumn: 'users.kyc_status', queryType: 'single', lType: 'kyc_status', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.kycStatus },
};

/**
 * Formats a given value based on the provided data type.
 *
 * Supported data types:
 *  - 'INT': Returns the value as a number (as a string for query embedding).
 *  - 'STRING': Escapes and wraps the value in single quotes.
 *  - 'BOOLEAN': Returns the SQL literal true or false.
 *  - 'DATE': Converts the value to an ISO string and wraps it in single quotes.
 *
 * @param {*} value - The value to format.
 * @param {string} dataType - The data type ('INT', 'STRING', 'BOOLEAN', 'DATE').
 * @returns {string} - The formatted value ready for insertion into an SQL query.
 * @throws {Error} - If an unsupported data type is provided or if a date is invalid.
 */
export function formatSQLValue(value, dataType) {

  switch (dataType) {
    case 'INT':
      // Convert to a number and return its string representation.
      return String(Number(value));

    case 'STRING':
      return `'${String(value).replace(/'/g, "''")}'`;

    case 'BOOLEAN':
      return value ? 'true' : 'false';

    case 'DATE': {
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${value}`);
      }
      return `'${dateObj.toISOString()}'`;
    }

    default:
      return value;
  }
}
export const emailTemplate = `
          <p>Hello,</p>
          </br>
          <p>Your requested file has been generated successfully. Please find it attached to this email.</p>
          <p>Thank you for using our service!</p>
      `;
