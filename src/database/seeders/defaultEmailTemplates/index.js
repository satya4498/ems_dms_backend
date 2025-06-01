import fs from 'fs'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'
import path from 'path'

const defaultEmailTemplates = [{
  is_default: true,
  label: 'Active User',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.ACTIVE_USER,
  dynamic_data: JSON.stringify(['siteName', 'subject', 'siteUrl', 'siteLogo']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './activeUser.html')).toString() })
}, {
  is_default: true,
  label: 'Inactive User',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.INACTIVE_USER,
  dynamic_data: JSON.stringify(['siteName', 'subject', 'siteUrl', 'siteLogo', 'reason']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './inactiveUser.html')).toString() })
}, {
  is_default: true,
  label: 'Email Verification',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.EMAIL_VERIFICATION,
  dynamic_data: JSON.stringify(['link', 'subject', 'siteName', 'siteLogo']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './emailVerification.html')).toString() })
}, {
  is_default: true,
  label: 'Reset Password',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.RESET_PASSWORD,
  dynamic_data: JSON.stringify(['otp', 'subject', 'siteName', 'siteLogo', 'siteUrl']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './resetPassword.html')).toString() })
}, {
  is_default: true,
  label: 'KYC Verified',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.KYC_ACTIVATED,
  dynamic_data: JSON.stringify(['kycLabels', 'subject', 'reason', 'siteName', 'siteLogo', 'siteUrl']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './kycVerified.html')).toString() })
}, {
  is_default: true,
  label: 'Document Verified',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.DOCUMENT_VERIFIED,
  dynamic_data: JSON.stringify(['subject', 'siteName', 'userName', 'siteLogo']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './documentVerified.html')).toString() })
}, {
  is_default: true,
  label: 'Document Rejected',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.DOCUMENT_REJECTED,
  dynamic_data: JSON.stringify(['subject', 'kycLabels', 'siteName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './documentRejected.html')).toString() })
}, {
  is_default: true,
  label: 'Document Requested',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.DOCUMENT_RECEIVED,
  dynamic_data: JSON.stringify(['subject', 'siteName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './documentRequested.html')).toString() })
}, {
  is_default: true,
  label: 'Withdraw Request Received',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.WITHDRAW_REQUEST_RECEIVED,
  dynamic_data: JSON.stringify(['subject', 'withdrawAmount', 'playerCurrencySymbol', 'siteName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './withdrawRequestReceived.html')).toString() })
}, {
  is_default: true,
  label: 'Withdraw Request Approved',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.WITHDRAW_REQUEST_APPROVED,
  dynamic_data: JSON.stringify(['subject', 'withdrawAmount', 'playerCurrencySymbol', 'siteName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './withdrawRequestApproved.html')).toString() })
}, {
  is_default: true,
  label: 'Withdraw Processed',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.WITHDRAW_PROCESSED,
  dynamic_data: JSON.stringify(['subject', 'withdrawAmount', 'playerCurrencySymbol', 'transactionId']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './withdrawProcessed.html')).toString() })
}, {
  is_default: true,
  label: 'Deposit Success',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.DEPOSIT_SUCCESS,
  dynamic_data: JSON.stringify(['transactionId', 'subject', 'playerCurrencySymbol', 'depositAmount']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './depositSuccess.html')).toString() })
}, {
  is_default: true,
  label: 'Deposit Failed',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.DEPOSIT_FAILED,
  dynamic_data: JSON.stringify(['transactionId', 'subject', 'playerCurrencySymbol', 'depositAmount']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './depositFailed.html')).toString() })
}, {
  is_default: true,
  label: 'Welcome',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.WELCOME,
  dynamic_data: JSON.stringify(['playerFullName', 'subject', 'siteLoginUrl', 'userName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './welcome.html')).toString() })
}, {
  is_default: true,
  label: 'Gambling Registration',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.GAMBLING_REGISTRATION,
  dynamic_data: JSON.stringify(['subject', 'supportEmailAddress', 'sendSupportRequestRoute']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './gamblingRegistration.html')).toString() })
}, {
  is_default: true,
  label: 'Password Updated',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.PASSWORD_UPDATED,
  dynamic_data: JSON.stringify(['playerEmail', 'newPassword', 'siteLoginUrl']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './passwordUpdated.html')).toString() })
}, {
  is_default: true,
  label: 'Joining Bonus',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.JOINING_BONUS,
  dynamic_data: JSON.stringify(['userName', 'joiningAmount', 'siteName']),
  template_code: JSON.stringify({ EN: fs.readFileSync(path.join(__dirname, './joiningBonus.html')).toString() })
}]

export { defaultEmailTemplates }
