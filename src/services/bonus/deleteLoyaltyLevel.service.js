import { APIError } from '@src/errors/api.error';
import ajv from '@src/libs/ajv';
import { ServiceBase } from '@src/libs/serviceBase';

const schema = {
  type: 'object',
  properties: {
    loyaltyLevelId: { type: 'number' }
  },
  required: ['loyaltyLevelId']
};

const constraints = ajv.compile(schema);

export class DeleteLoyaltyLevelService extends ServiceBase {
  get constraints () {
    return constraints;
  }

  async run () {
    const { loyaltyLevelId } = this.args;
    const transaction = await this.context.sequelize.transaction(); // Start a new transaction

    try {
      const loyaltyLevelModel = this.context.sequelize.models.loyaltyLevel;

      // Find the level to delete
      const loyaltyLevel = await loyaltyLevelModel.findOne({
        where: { id: loyaltyLevelId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!loyaltyLevel) {
        await transaction.rollback();
        return this.addError('LoyaltyLevelNotFound');
      }

      const tag = await this.context.sequelize.models.tag.findOne({ where: { tag: loyaltyLevel.name.EN } })
      await tag.destroy()

      // Delete the level
      await loyaltyLevel.destroy({ transaction });

      // Fetch remaining levels ordered by levelUpPoints
      const remainingLevels = await loyaltyLevelModel.findAll({
        order: [['levelUpPoints', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      // Reassign level numbers to maintain sequence
      for (let i = 0; i < remainingLevels.length; i++) {
        await loyaltyLevelModel.update(
          { level: i + 1 }, // Only update the level column
          { where: { id: remainingLevels[i].id }, transaction }
        );
      }
      
      await transaction.commit()

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw new APIError(error);
    }
  }
}
