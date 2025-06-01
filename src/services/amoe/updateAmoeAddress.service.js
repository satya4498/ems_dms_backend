import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
    type: 'object',
    properties: {
        addressLine1: { type: 'string' },
        addressLine2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postalCode: { type: 'string' },
        country: { type: 'string' },
    }
})

export class UpdateAmoeAddressService extends ServiceBase {
    get constraints() {
        return constraints
    }
    async run() {
        const addressLine1 = this.args.addressLine1
        const addressLine2 = this.args.addressLine2
        const city = this.args.city
        const state = this.args.state
        const postalCode = this.args.postalCode
        const country = this.args.country

        try {
            const settings = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.AMOE_ADDRESS } })
            const value = JSON.parse(settings.value)
            if (addressLine1) value.addressLine1 = addressLine1
            if (addressLine2) value.addressLine2 = addressLine2
            if (city) value.city = city
            if (postalCode) value.postalCode = postalCode
            if (state) value.state = state
            if (country) value.country = country
            settings.value = JSON.stringify(value)
            await settings.save()
            populateSettingsCache()
            return JSON.parse(settings.value)
        } catch (error) {
            throw new APIError(error)
        }
    }
}
