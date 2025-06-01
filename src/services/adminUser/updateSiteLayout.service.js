import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    siteLayout: {
      type: 'object',
      properties: {
        error: { type: 'string', default: '' },
        isMobile: { type: 'boolean', default: false },
        leftMenu: { type: 'boolean', default: false },
        isLoading: { type: 'boolean', default: true },
        isPreloader: { type: 'boolean', default: false },
        showSidebar: { type: 'boolean', default: false },
        showBreadcrumb: { type: 'boolean', default: false },
        showRightSidebar: { type: 'boolean', default: false },
        layoutType: { enum: ['vertical', 'horizontal'], default: 'vertical' },
        layoutWidth: { enum: ['fluid', 'boxed', 'scrollable'], default: 'fluid' },
        topbarTheme: { enum: ['light', 'dark', 'colored'], default: 'light' },
        layoutModeType: { enum: ['light', 'dark'], default: 'light' },
        leftSideBarType: { enum: ['default', 'compact', 'icon', 'abc'], default: 'default' },
        leftSideBarTheme: { enum: ['light', 'colored', 'dark', 'winter', 'ladylip', 'plumplate', 'strongbliss', 'greatwhale'], default: 'dark' },
        tableHeaderClass: { enum: ['table-light', 'empty'], default: 'table-light' },
        leftSideBarThemeImage: { enum: ['none', 'img1', 'img2', 'img3', 'img4'], default: 'none' }
      }
    }
  },
  required: ['adminUserId']
})

export class UpdateSiteLayoutService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      await this.context.sequelize.models.adminUser.update({
        siteLayout: this.args.siteLayout
      }, {
        where: { id: this.args.adminUserId }
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
