import { APIError } from '@src/errors/api.error';
import ajv from '@src/libs/ajv';
import { ServiceBase } from '@src/libs/serviceBase';
import { uploadFile } from '@src/libs/s3';
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { Op, Sequelize } from 'sequelize';
import { UpdateTagService } from '../playerManagement/tag/updateTag.service';

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'object', nullable: true },
    levelUpPoints: { type: 'number', coerce: true },
    iconImage: { type: 'object' },
    levelDescription: { type: 'object' },
    loyaltyBonusAmount: { type: 'object' },
    daysToClear: { type: 'string' }
  },
  required: ['id']
});

export class UpdateLoyaltyLevelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      args: { id, name, levelUpPoints, iconImage, levelDescription, loyaltyBonusAmount, daysToClear }
    } = this;
    const transaction = await this.context.sequelize.transaction(); // Start transaction

    try {
      const loyaltyLevels = await this.context.sequelize.models.loyaltyLevel.findAll({
        order: [['levelUpPoints', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      // Find the current level
      const currentLevelIndex = loyaltyLevels.findIndex(l => l.id === id);
      if (currentLevelIndex === -1) {
        await transaction.rollback();
        return this.addError('LoyaltyLevelNotFound');
      }

      const currentLevel = loyaltyLevels[currentLevelIndex];
      const prevLevel = loyaltyLevels[currentLevelIndex - 1] || null;
      const nextLevel = loyaltyLevels[currentLevelIndex + 1] || null;
      const loyaltyName = currentLevel.name.EN

      // Ensure levelUpPoints is greater than loyaltyBonusAmount
      if (levelUpPoints !== undefined && parseInt(loyaltyBonusAmount.SC) !== undefined) {
        if (levelUpPoints <= parseInt(loyaltyBonusAmount.SC)) {
          await transaction.rollback();
          return this.addError('LevelUpPointsMustBeGreaterThanLoyaltyBonusAmountError');
        }
      }

      // If loyaltyBonusAmount is changed, validate it against previous and next levels
      if (parseInt(loyaltyBonusAmount.SC) !== undefined) {
        if (prevLevel && parseInt(loyaltyBonusAmount.SC) <= parseInt(prevLevel.loyaltyBonusAmount.SC)) {
          await transaction.rollback();
          return this.addError('LoyaltyBonusAmountGreaterThanPreviousLevelError');
        }
        if (nextLevel && parseInt(loyaltyBonusAmount.SC) >= parseInt(nextLevel.loyaltyBonusAmount.SC)) {
          await transaction.rollback();
          return this.addError('LoyaltyBonusAmountLessThanNextLevelError');
        }
      }


      let newIndex = currentLevelIndex;
      if (levelUpPoints !== undefined && levelUpPoints !== currentLevel.levelUpPoints) {
        const sortedLevels = loyaltyLevels.filter(l => l.id !== id);
        newIndex = sortedLevels.findIndex(l => l.levelUpPoints > levelUpPoints);
        if (newIndex === -1) newIndex = sortedLevels.length;

        const newPrevLevel = sortedLevels[newIndex - 1] || null;
        const newNextLevel = sortedLevels[newIndex] || null;
        if (newPrevLevel && parseInt(loyaltyBonusAmount.SC) <= parseInt(newPrevLevel.loyaltyBonusAmount.SC)) {
          await transaction.rollback();
          return this.addError('LoyaltyBonusAmountGreaterThanPreviousLevelError');
        }
        if (newNextLevel && parseInt(loyaltyBonusAmount.SC) >= parseInt(newNextLevel.loyaltyBonusAmount.SC)) {
          await transaction.rollback();
          return this.addError('LoyaltyBonusAmountLessThanNextLevelError');
        }

        // Remove and insert at the new position
        sortedLevels.splice(newIndex, 0, { ...currentLevel, levelUpPoints });
        // Update all levels based on the new order
        for (let i = 0; i < sortedLevels.length; i++) {
          const currentLevel = sortedLevels[i];
          const prevLevel = sortedLevels[i - 1]; // Previous level
          const nextLevel = sortedLevels[i + 1]; // Next level
          if (prevLevel && parseInt(currentLevel.dataValues.loyaltyBonusAmount.SC) <= parseInt(prevLevel.dataValues.loyaltyBonusAmount.SC)) {
            return this.addError('LoyaltyBonusAmountGreaterThanPreviousLevelError')
          }

          if (nextLevel && parseInt(currentLevel.dataValues.loyaltyBonusAmount.SC) >= parseInt(nextLevel.dataValues.loyaltyBonusAmount.SC)) {
            return this.addError('LoyaltyBonusAmountLessThanNextLevelError')
          }
        }

      }

      // Prepare update payload
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (levelUpPoints !== undefined) updateData.levelUpPoints = levelUpPoints;
      if (levelDescription !== undefined) updateData.levelDescription = levelDescription;
      if (loyaltyBonusAmount !== undefined) updateData.loyaltyBonusAmount = loyaltyBonusAmount;
      if (daysToClear !== undefined) updateData.daysToClear = daysToClear;

      if (iconImage) {
        const iconFileLocation = await uploadFile(iconImage.buffer, {
          name: `loyalty_icon_${id}`,
          mimetype: iconImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.bonus
        });
        updateData.iconUrl = iconFileLocation;
      }

      // Apply updates
      const loyaltyLevel = await this.context.sequelize.models.loyaltyLevel.update(updateData, {
        where: { id: id },
        transaction
      });

      const tag = await this.context.sequelize.models.tag.findOne({
        where: { tag: loyaltyName }
      })
      await UpdateTagService.execute({ tagId: tag?.id, name: name.EN }, this.context)

      await transaction.commit();
      return { loyaltyLevel };
    } catch (error) {
      await transaction.rollback();
      throw new APIError(error);
    }
  }
}
