export const SPORTSBOOK_ENTITY_TYPES = {
  SPORT: 'sport',
  LEAGUE: 'league',
  LOCATION: 'location'
}

// ExchangeBet constants start
export const EXCHANGE_BET_TYPES = {
  LAY: 'lay',
  BACK: 'back'
}

export const MATCHING_STATUS = {
  UNMATCHED: 'unmatched',
  FULLY_MATCHED: 'fully_matched',
  PARTIALLY_MATCHED: 'partially_matched'
}
// ExchangeBet constants end

// Event constants start
export const EVENT_STATUS = {
  NOT_STARTED: '0',
  IN_PROGRESS: '1',
  FINISHED: '2',
  CANCELLED: '3',
  POSTPONED: '4',
  INTERRUPTED: '5',
  ABANDONED: '6',
  COVERAGE_LOST: '7'
}
// Event constants end

// Event market constant start
export const EVENT_MARKET_STATUS = {
  LOCKED: '0',
  OPEN: '1',
  SUSPENDED: '2'
}
// Event market constant end

// EventMarketOutcome constants start
export const OUTCOME_SETTLEMENT_STATUS = {
  PENDING: '0',
  LOST: '1',
  WON: '2',
  HALF_LOST: '3',
  HALF_WON: '4',
  REFUND: '5',
  CANCELLED: '6'
}

export const OUTCOME_STATUS = {
  OPEN: '1',
  SUSPENDED: '0',
  SETTLED: '2'
}
// EventMarketOutcome constants end

// BetSlip constants start
export const BET_SLIP_TYPES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
}

export const BET_SLIP_SETTLEMENT_STATUS = {
  WON: 'won',
  LOST: 'lost',
  REFUND: 'refund',
  PENDING: 'pending',
  CASHOUT: 'cashout',
  HALF_WON: 'half_won',
  HALF_LOST: 'half_lost'
}
// BetSlip constants end

// Sportsbook transaction start
export const SPORTSBOOK_TRANSACTION_TYPE = {
  EXCHANGE: 'exchange',
  SPORTSBOOK: 'sportsbook'
}

export const SPORTSBOOK_TRANSACTION_STATUS = {
  FAILED: 'failed',
  PENDING: 'pending',
  COMPLETED: 'completed'
}
