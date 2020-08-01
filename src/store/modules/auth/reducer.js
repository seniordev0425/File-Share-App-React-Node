import { createAction, handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  requestSuccess,
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import { CLOSE_ACCOUNT } from 'store/modules/user'
import {
  LOGIN,
  LOGOUT,
  LOGIN_FROM_TWOFACTOR,
  LOAD_KEY_LIST,
  CREATE_KEY,
  DELETE_KEY,
} from './constants'
import { APIKey, State } from './models'


/* Initial state */

const initialState = new State({
  token: '',
  expiresAt: null,
  passed2fa: false,
})

/* Action creators */

export const {
  start: login,
  success: loginSuccess,
  fail: loginFail,
} = defineLoopActions(LOGIN)

export const logout = createAction(LOGOUT)

export const loginFromTwoFactor = createAction(LOGIN_FROM_TWOFACTOR)

export const {
  start: loadKeyList,
  success: loadKeyListSuccess,
  fail: loadKeyListFail,
  reset: loadKeyListReset,
} = defineLoopActions(
  LOAD_KEY_LIST,
  {
    failureMessage: 'Failed to load key list.'
  }
)

export const {
  start: createKey,
  success: createKeySuccess,
  fail: createKeyFail,
} = defineLoopActions(
  CREATE_KEY,
  {
    failureMessage: 'Failed to create a key.'
  }
)

export const {
  start: deleteKey,
  success: deleteKeySuccess,
  fail: deleteKeyFail,
} = defineLoopActions(
  DELETE_KEY,
  {
    failureMessage: 'Failed to delete a key.'
  }
)

/* Reducer */

const doLogin = (record, auth_token, expires_in, passed2fa) => {
  record.set('token', auth_token)

  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + expires_in)
  record.set('expiresAt', expiresAt)

  record.set('passed2fa', passed2fa)
}

const doLogout = record => {
  record.set('token', '')
  record.set('expiresAt', null)
  record.set('passed2fa', false)
}

export const reducer = handleActions({

  /* Log in */

  ...requestLoopHandlersForUpdate({
    action: LOGIN,
    stateField: 'loginState',
    onSuccess: (record, payload) => {
      const { auth_token, expires_in } = payload
      doLogin(record, auth_token, expires_in, !payload['2factor'])
    },
    onFail: record => doLogout(record),
  }),

  [LOGOUT]: (state) => state.withMutations(record => doLogout(record)),

  /* Update auth token and passed2fa flag from 2fa payload when user passed 2fa */

  [LOGIN_FROM_TWOFACTOR]: (state, { payload }) => state.withMutations(record => {
    if (payload.auth_token) {
      doLogin(record, payload.auth_token, payload.expires_in, true)
    }
  }),

  /* Logout when account closed */

  [requestSuccess(CLOSE_ACCOUNT)]: (state) => state.withMutations(record => doLogout(record)),

  /* Load API key list */

  ...requestLoopHandlersForGet({
    action: LOAD_KEY_LIST,
    dataField: 'apiKeyList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.api_keys, APIKey),
    usePagination: false,
  }),

  /* Create API key */

  ...requestLoopHandlersForUpdate({
    action: CREATE_KEY,
    stateField: 'createKeyState',
    onSuccess: (record, payload, initialPayload) => {
      if (initialPayload.onSuccess) {
        initialPayload.onSuccess(payload.api_key)
      }
    },
  }),

  /* Delete API key */

  ...requestLoopHandlersForUpdate({
    action: DELETE_KEY,
    stateField: 'deleteKeyState',
    onSuccess: (record, payload, initialPayload) => record.setIn(
      ['apiKeyList', 'data'],
      record.apiKeyList.data.filter(apiKey => apiKey.id !== initialPayload.id)
    ),
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('auth'),

}, initialState)
