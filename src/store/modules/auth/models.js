import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'


export const APIKey = Record({
  id: '',
  api_key: '',
  memo: '',
  created: ''
}, 'APIKey')

export const State = Record({
  loginState: REQUEST_STATUS.INITIAL,
  token: '',
  expiresAt: null,
  passed2fa: false,
  apiKeyList: ListData(),
  createKeyState: '',
  deleteKeyState: '',
}, 'AuthState')

export const blacklistedFields = [
  'loginState',
  'createKeyState',
  'deleteKeyState',
]
