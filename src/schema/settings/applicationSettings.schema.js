export const getApplicationSettingsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            maxOdds: { type: 'object' },
            minOdds: { type: 'object' },
            allowBetting: { type: 'object' },
            minStakeAmount: { type: 'object' },
            exchangeBetCommission: { type: 'object' },
            casino: { type: 'object' },
            sportsbook: { type: 'object' },
            defaultSupport: { type: 'object' },
            adminEndUrl: { type: 'object' },
            userEndUrl: { type: 'object' },
            gallery: { type: 'object' },
            referral: { type: 'object' },
            amoEntryAddress: { type: 'object' },
            applicationName: { type: 'object' },
            enable2fa: { type: 'object' },
            maintenance: { type: 'object' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
