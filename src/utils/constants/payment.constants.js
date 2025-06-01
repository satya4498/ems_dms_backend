export const PAYMENT_PROVIDER = {
  NETELLER: 'NETELLER',
  SKRILL: 'SKRILL',
  HIPAY: 'HIPAY',
  COINPAYMENT: 'COINPAYMENT'
}

// Payment Handle Types
export const PAYSAFE_TRANSACTION_TYPE = {
  PAYMENT: 'PAYMENT',
  STANDALONE_CREDIT: 'STANDALONE_CREDIT'
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

export const SKRILL_PAYMENT_STATUS = {
  SUCCESS: 1,
  FAILED: 2,
  PENDING: 0
}

export const PAYMENT_PROVIDER_CATEGORY = {
  INSTANT_BANKING: 'Instant Banking',
  CREDIT_CARD: 'Credit Card',
  CRYPTO: 'Crypto',
  WALLET: 'Wallet',
  VOUCHERS: 'Vouchers',
  OTHER: 'Other'
}

export const PAYMENT_AGGREGATOR = {
  PAYSAFE: 'PaySafe',
  COINPAYMENT: 'COINPAYMENT'
}
