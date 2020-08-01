import { createAction, handleActions } from 'redux-actions'

import {
  requestSuccess,
  defineLoopActions,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  VERIFY_TWOFACTOR,
  REMOVE_TWOFACTOR,
} from 'store/modules/twofactor/constants'
import {
  LOAD_USER_DETAIL,
  UPDATE_USER_DETAIL,
  SET_UPDATE_USER_LAST_ERROR,
  CHECK_PASSWORD_CODE,
  SET_PASSWORD,
  RESET_PASSWORD,
  CLOSE_ACCOUNT,
  REST_PASSWORD_INITIAL
} from './constants'
import {
  User, PasswordCodeData, State
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadUser,
  success: loadUserSuccess,
  fail: loadUserFail,
} = defineLoopActions(
  LOAD_USER_DETAIL,
  {
    failureMessage: 'Failed to load user details.'
  }
)

export const {
  start: updateUser,
  success: updateUserSuccess,
  fail: updateUserFail,
  reset: updateUserReset,
} = defineLoopActions(
  UPDATE_USER_DETAIL,
  {
    failureMessage: 'Failed to update account profile.',
    successMessage: 'Account profile was successfully updated.',
  }
)

export const setUpdateUserLastError = createAction(SET_UPDATE_USER_LAST_ERROR)

export const {
  start: checkPasswordCode,
  success: checkPasswordCodeSuccess,
  fail: checkPasswordCodeFail,
} = defineLoopActions(
  CHECK_PASSWORD_CODE,
  {
    failureMessage: 'Failed to check password code.'
  }
)

export const {
  start: setPassword,
  success: setPasswordSuccess,
  fail: setPasswordFail,
  reset: setPasswordReset,
} = defineLoopActions(
  SET_PASSWORD,
  {
    failureMessage: 'Failed to update password.',
    successMessage: 'Password was successfully updated.',
  }
)

export const {
  start: resetPassword,
  success: resetPasswordSuccess,
  fail: resetPasswordFail,
} = defineLoopActions(
  RESET_PASSWORD,
  {
    failureMessage: 'Failed to reset password'
  }
)

export const resetPasswordInitial = createAction(REST_PASSWORD_INITIAL)

export const {
  start: closeAccount,
  success: closeAccountSuccess,
  fail: closeAccountFail,
  reset: closeAccountReset,
} = defineLoopActions(
  CLOSE_ACCOUNT,
  {
    failureMessage: 'Failed to close your account',
    successMessage: 'Your account was successfully closed.',
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load user detail */

  ...requestLoopHandlersForGet({
    action: LOAD_USER_DETAIL,
    dataField: 'user',
    getDataFromPayload: payload => User(payload.user),
  }),

  /* Update user settings */

  ...requestLoopHandlersForUpdate({
    action: UPDATE_USER_DETAIL,
    stateField: 'updateUserState',
    onSuccess: (record, payload, initialPayload) => record.setIn(
      ['user', 'data'],
      record.getIn(['user', 'data']).merge(initialPayload.data)
    ),
  }),

  /* Set last error from update user api call */

  [SET_UPDATE_USER_LAST_ERROR]: (state, { payload }) => state.withMutations(record => {
    record.set('updateUserLastError', payload)
  }),

  /* Check password code */

  ...requestLoopHandlersForGet({
    action: CHECK_PASSWORD_CODE,
    dataField: 'passwordCodeData',
    getDataFromPayload: payload => PasswordCodeData(payload),
  }),

  /* Set password */

  ...requestLoopHandlersForUpdate({
    action: SET_PASSWORD,
    stateField: 'setPasswordState',
  }),

  /* Reset password */

  ...requestLoopHandlersForUpdate({
    action: RESET_PASSWORD,
    stateField: 'resetPasswordState',
  }),

  [REST_PASSWORD_INITIAL]: (state, { payload }) => state.withMutations(record => {
    record.set('resetPasswordState', payload)
  }),

  /* Set 2fa status of the user to enabled when 2fa code verified */

  [requestSuccess(VERIFY_TWOFACTOR)]: (state, { payload }) => state.setIn(['user', 'data', '2factor'], true),

  /* Set 2fa status of the user to disabled when 2fa removed */

  [requestSuccess(REMOVE_TWOFACTOR)]: (state, { payload }) => state.setIn(['user', 'data', '2factor'], false),

  /* Close account */

  ...requestLoopHandlersForUpdate({
    action: CLOSE_ACCOUNT,
    stateField: 'closeAccountState',
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('user'),

}, initialState)
