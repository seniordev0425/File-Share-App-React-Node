const namespace = 'fastio/twofactor'

export const TWOFACTOR_STATE = {
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  UNVERIFIED: 'unverified',
}

export const TWOFACTOR_PREFERENCE = {
  AUTHY: 'authy',
  SMS: 'sms',
  CALL: 'call',
}

export const GET_TWOFACTOR = `${namespace}/get`
export const ADD_TWOFACTOR = `${namespace}/add`
export const RESET_TWOFACTOR_ADDING_PROCESS = `${namespace}/reset_adding_process`
export const VERIFY_TWOFACTOR = `${namespace}/verify`
export const SET_TWOFACTOR_VERIFICATION_RESULT = `${namespace}/set_verification_result`
export const SEND_TWOFACTOR_CODE_BY_CALL = `${namespace}/send_code/by_call`
export const SEND_TWOFACTOR_CODE_BY_SMS = `${namespace}/send_code/by_sms`
export const AUTHENTICATE_TWOFACTOR = `${namespace}/authenticate`
export const SET_TWOFACTOR_AUTHENTICATION_RESULT = `${namespace}/set_authentication_result`
export const REMOVE_TWOFACTOR = `${namespace}/remove`
export const SET_TWOFACTOR_PREFERENCE = `${namespace}/set_preference`
