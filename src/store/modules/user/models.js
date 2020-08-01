import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'


export const User = Record({
  id: '',
  email_address: '',
  country_code: '',
  tos_agree: true,
  first_name: '',
  last_name: '',
  phone_country: null,
  phone_number: null,
  '2factor': false,
  subscriber: true,
  valid_phone: false,
  valid_email: true,
  locked: false,
  suspended: false,
  updated: '',
  created: '',
}, 'User')

export const PasswordCodeData = Record({
  email: '',
}, 'PasswordCodeData')

export const State = Record({
  user: DetailData(),
  updateUserState: REQUEST_STATUS.INITIAL,
  updateUserLastError: null,
  passwordCodeData: DetailData(),
  setPasswordState: REQUEST_STATUS.INITIAL,
  resetPasswordState: REQUEST_STATUS.INITIAL,
  closeAccountState: REQUEST_STATUS.INITIAL,
}, 'UserState')

export const blacklistedFields = [
  'updateUserState',
  'updateUserLastError',
  'passwordCodeData',
  'setPasswordState',
  'resetPasswordState',
  'closeAccountState',
]
