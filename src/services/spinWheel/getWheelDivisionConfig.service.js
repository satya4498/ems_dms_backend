import { ServiceBase } from '@src/libs/serviceBase'

export class GetSpinWheelService extends ServiceBase {
  async run () {
    const wheelConfiguration = await this.context.sequelize.models.wheelDivisionConfiguration.findAll({ order: [['id', 'ASC']] })
    return { success: true, wheelConfiguration }
  }
}
