import { APIError } from '@src/errors/api.error';
import ajv from '@src/libs/ajv';
import { ServiceBase } from '@src/libs/serviceBase';



const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
  required: ['id'],
})


export class DeletePackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.args;
    const transaction = this.context.sequelizeTransaction;

    try {
      // Find the package to delete
      const packageToDelete = await this.context.sequelize.models.package.findByPk(id, { transaction });
      if (!packageToDelete) return this.addError('PackageNotFoundErrorType');

      // Delete the package
      await packageToDelete.destroy({ transaction });

      return { success: true };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
