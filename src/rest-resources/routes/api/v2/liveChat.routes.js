import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { LiveChatController } from '@src/rest-resources/controllers/liveChat.controller'
import { createChatGroupSchema, updateChatGroupSchema } from '@src/schema/chatModule/chatGroup'
import { getChatGroupSchema } from '@src/schema/chatModule/chatGroup/getChatGroups.schema'
import { getGroupUsersSchema } from '@src/schema/chatModule/chatGroup/getGroupUsers.schema'
import { getGroupChatSchema } from '@src/schema/chatModule/message/getGroupChat.schema'
import { getUserChatSchema } from '@src/schema/chatModule/message/getUserChat.schema'
import { getReportedUserSchema } from '@src/schema/chatModule/reportedUser/getReportedUser.schema'
import { createChatRainSchema } from '@src/schema/chatModule/chatRain/createChatRain.schema'
import { updateChatRainSchema } from '@src/schema/chatModule/chatRain/updateChatRain.schema'
import { getChatRainSchema } from '@src/schema/chatModule/chatRain/getChatRain.schema'
import { createChatRuleSchema } from '@src/schema/chatModule/chatRule/createChatRule.schema'
import { updateChatRuleSchema } from '@src/schema/chatModule/chatRule/updateChatRule.schema'
import { getChatRuleSchema } from '@src/schema/chatModule/chatRule/getChatRule.schema'
import { createOffensiveWordSchema } from '@src/schema/chatModule/offensiveWords/createOffensiveWord.schema'
import { getOffensiveWordsSchema } from '@src/schema/chatModule/offensiveWords/getOffenesiveWord.schema'
import { deleteOffensiveWordsSchema } from '@src/schema/chatModule/offensiveWords/deleteOffensiveWord.schema'

const liveChatRouter = express.Router({ mergeParams: true })

liveChatRouter.post(
  '/create-group',
  requestValidationMiddleware(createChatGroupSchema),
  isAuthenticated(),
  LiveChatController.createChatGroup,
  responseValidationMiddleware(createChatGroupSchema)
)

liveChatRouter.post(
  '/update-group',
  isAuthenticated(),
  requestValidationMiddleware(updateChatGroupSchema),
  LiveChatController.updateChatGroup,
  responseValidationMiddleware(updateChatGroupSchema)
)

liveChatRouter.get(
  '/get-group',
  requestValidationMiddleware(getChatGroupSchema),
  isAuthenticated(),
  LiveChatController.getChatGroup,
  responseValidationMiddleware(getChatGroupSchema)
)

liveChatRouter.get(
  '/get-group-users',
  requestValidationMiddleware(getGroupUsersSchema),
  isAuthenticated(),
  LiveChatController.getChatGroupUser,
  responseValidationMiddleware(getGroupUsersSchema)
)

liveChatRouter.get(
  '/get-group-chats',
  requestValidationMiddleware(getGroupChatSchema),
  isAuthenticated(),
  LiveChatController.getGroupMessage,
  responseValidationMiddleware(getGroupChatSchema)
)

liveChatRouter.get(
  '/get-user-chats',
  requestValidationMiddleware(getUserChatSchema),
  isAuthenticated(),
  LiveChatController.getUserMessage,
  responseValidationMiddleware(getUserChatSchema)
)

liveChatRouter.get(
  '/get-reported-user',
  requestValidationMiddleware(getReportedUserSchema),
  isAuthenticated(),
  LiveChatController.getReportedUser,
  responseValidationMiddleware(getReportedUserSchema)
)

liveChatRouter.post(
  '/create-chat-rain',
  requestValidationMiddleware(createChatRainSchema),
  isAuthenticated(),
  LiveChatController.createChatRain,
  responseValidationMiddleware(createChatRainSchema)
)

liveChatRouter.post(
  '/update-chat-rain',
  requestValidationMiddleware(updateChatRainSchema),
  isAuthenticated(),
  LiveChatController.updateChatRain,
  responseValidationMiddleware(updateChatRainSchema)
)

liveChatRouter.get(
  '/get-chat-rain',
  requestValidationMiddleware(getChatRainSchema),
  isAuthenticated(),
  LiveChatController.getChatRain,
  responseValidationMiddleware(getChatRainSchema)
)

liveChatRouter.get(
  '/get-chat-rule',
  requestValidationMiddleware(getChatRuleSchema),
  isAuthenticated(),
  LiveChatController.getChatRule,
  responseValidationMiddleware(getChatRuleSchema)
)

liveChatRouter.post(
  '/create-chat-rule',
  requestValidationMiddleware(createChatRuleSchema),
  isAuthenticated(),
  LiveChatController.createChatRule,
  responseValidationMiddleware(createChatRuleSchema)
)

liveChatRouter.post(
  '/update-chat-rule',
  requestValidationMiddleware(updateChatRuleSchema),
  isAuthenticated(),
  LiveChatController.updateChatRule,
  responseValidationMiddleware(updateChatRuleSchema)
)

liveChatRouter.get(
  '/get-offensive-words',
  requestValidationMiddleware(getOffensiveWordsSchema),
  isAuthenticated(),
  LiveChatController.getOffensiveWords,
  responseValidationMiddleware(getOffensiveWordsSchema)
)

liveChatRouter.post(
  '/create-offensive-word',
  requestValidationMiddleware(createOffensiveWordSchema),
  isAuthenticated(),
  LiveChatController.createOffensiveWord,
  responseValidationMiddleware(createOffensiveWordSchema)
)

liveChatRouter.delete(
  '/delete-offensive-word',
  requestValidationMiddleware(deleteOffensiveWordsSchema),
  isAuthenticated(),
  LiveChatController.deleteOffensiveWord,
  responseValidationMiddleware(deleteOffensiveWordsSchema)
)

export { liveChatRouter }
