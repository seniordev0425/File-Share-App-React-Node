import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'


export const TwoFactorPayload = Record({
  result: false,
  auth_token: '',
  expires_in: 0,
}, 'TwoFactorPayload')

export const State = Record({
  twoFactor: DetailData(),
  addTwoFactorState: REQUEST_STATUS.INITIAL,
  verifyCodeState: REQUEST_STATUS.INITIAL,
  verifyCodeResult: '',
  twoFactorAuth: DetailData(),
  twoFactorAuthResult: '',
  removeTwoFactorState: REQUEST_STATUS.INITIAL,
  sendCodeState: REQUEST_STATUS.INITIAL,
  preference: '',
}, 'TwofactorState')

export const blacklistedFields = [
  'addTwoFactorState',
  'verifyCodeState',
  'verifyCodeResult',
  'twoFactorAuth',
  'twoFactorAuthResult',
  'removeTwoFactorState',
  'sendCodeState',
]
