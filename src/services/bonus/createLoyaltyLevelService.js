import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { uploadFile } from '@src/libs/s3'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'object' },
    levelUpPoints: { type: 'number', coerce: true },
    iconImage: { type: 'object' },
    levelDescription: { type: 'object' },
    loyaltyBonusAmount: { type: 'object' },
    daysToClear: { type: 'string' }
  },
  required: ['name', 'levelUpPoints', 'loyaltyBonusAmount']
});
export class CreateLoyaltyLevelsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { name, levelUpPoints, iconImage, levelDescription, loyaltyBonusAmount, daysToClear } } = this;
    const transaction = await this.context.sequelize.transaction();

    try {
      // Fetch all existing levels sorted by levelUpPoints
      const loyaltyLevels = await this.context.sequelize.models.loyaltyLevel.findAll({
        order: [['levelUpPoints', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE // Prevents race conditions
      });

      // Check if name already exists
      const existingName = loyaltyLevels.find(l => JSON.stringify(l.name) === JSON.stringify(name));
      if (existingName) {
        await transaction.rollback();
        return this.addError('AlreadyLoyaltyLevelWithThatNameOrIdExist');
      }

      if (loyaltyLevels.some(l => l.levelUpPoints === levelUpPoints)) {
        await transaction.rollback();
        return this.addError('LoyaltyLevelWithThatLevelUpPointsExists');
      }

      // Validate loyaltyBonusAmount
      if (parseInt(loyaltyBonusAmount.SC) >= levelUpPoints) {
        await transaction.rollback();
        return this.addError('LoyaltyBonusAmountLessThanLevelUpPointsError');
      }

      let newLevelPosition = loyaltyLevels.length + 1; // Default to last level
      let prevLevel = null;
      let nextLevel = null;

      for (let i = 0; i < loyaltyLevels.length; i++) {
        if (levelUpPoints < loyaltyLevels[i].levelUpPoints) {
          newLevelPosition = loyaltyLevels[i].level;
          nextLevel = loyaltyLevels[i];
          break;
        }
        prevLevel = loyaltyLevels[i];
      }

      // Ensure loyaltyBonusAmount is within valid range
      if (prevLevel && parseInt(loyaltyBonusAmount.SC) <= parseInt(prevLevel.loyaltyBonusAmount.SC)) {
        await transaction.rollback();
        console.log("error")
        return this.addError('LoyaltyBonusAmountGreaterThanPreviousLevelError');
      }

      if (nextLevel && parseInt(loyaltyBonusAmount.SC) >= parseInt(nextLevel.loyaltyBonusAmount.SC)) {
        await transaction.rollback();
        return this.addError('LoyaltyBonusAmountLessThanNextLevelError');
      }

      // Shift existing levels to maintain order
      await this.context.sequelize.models.loyaltyLevel.update(
        { level: Sequelize.literal('"level" + 1') },
        { where: { level: { [Op.gte]: newLevelPosition } }, transaction }
      );

      // Create the new loyalty level
      const loyaltyLevel = await this.context.sequelize.models.loyaltyLevel.create({
        level: newLevelPosition,
        levelUpPoints,
        levelDescription,
        loyaltyBonusAmount,
        name,
        daysToClear,
        iconUrl: null,
      }, { transaction });

      // Upload iconImage if provided
      if (iconImage) {
        const iconFileLocation = await uploadFile(iconImage.buffer, {
          name: `loyalty_icon_${loyaltyLevel.id}`,
          mimetype: iconImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.bonus
        });
        loyaltyLevel.iconUrl = iconFileLocation;
        await loyaltyLevel.save({ transaction });
      }

      //create segment for layalty level
      const tags = await this.context.sequelize.models.tag.findOne({ where: { tag: { [Op.iLike]: name.EN } } })
      if (!tags) {
        await this.context.sequelize.models.tag.create({
          tag: name.EN,
        })
      }
      await transaction.commit();
      return { loyaltyLevel };
    } catch (error) {
      console.log(error)
      await transaction.rollback();
      throw new APIError(error);
    }
  }
}