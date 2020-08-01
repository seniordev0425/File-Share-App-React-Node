import { createAction, handleActions } from 'redux-actions'

import { REQUEST_STATUS } from 'constants/common'
import {
  requestResetState,
  defineLoopActions,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  GET_TWOFACTOR,
  ADD_TWOFACTOR,
  RESET_TWOFACTOR_ADDING_PROCESS,
  VERIFY_TWOFACTOR,
  SET_TWOFACTOR_VERIFICATION_RESULT,
  AUTHENTICATE_TWOFACTOR,
  SET_TWOFACTOR_AUTHENTICATION_RESULT,
  REMOVE_TWOFACTOR,
  SEND_TWOFACTOR_CODE_BY_SMS,
  SEND_TWOFACTOR_CODE_BY_CALL,
  SET_TWOFACTOR_PREFERENCE,
} from './constants'
import { TwoFactorPayload, State } from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: getTwoFactor,
  success: getTwoFactorSuccess,
  fail: getTwoFactorFail,
} = defineLoopActions(
  GET_TWOFACTOR,
  {
    failureMessage: 'Failed to get two factor auth information'
  }
)

export const {
  start: addTwoFactor,
  success: addTwoFactorSuccess,
  fail: addTwoFactorFail,
} = defineLoopActions(
  ADD_TWOFACTOR,
  {
    failureMessage: 'Failed to add two factor authentication'
  }
)

export const resetTwoFactorAddingProcess = createAction(RESET_TWOFACTOR_ADDING_PROCESS)

export const {
  start: verifyTwoFactor,
  success: verifyTwoFactorSuccess,
  fail: verifyTwoFactorFail,
} = defineLoopActions(
  VERIFY_TWOFACTOR,
  {
    failureMessage: 'Failed to verify two factor.'
  }
)

export const setTwoFactorVerificationResult = createAction(SET_TWOFACTOR_VERIFICATION_RESULT)

export const {
  start: authenticateTwoFactor,
  success: authenticateTwoFactorSuccess,
  fail: authenticateTwoFactorFail,
} = defineLoopActions(
  AUTHENTICATE_TWOFACTOR,
  {
    failureMessage: 'Failed to get two factor'
  }
)

export const authenticateTwoFactorReset = createAction(requestResetState(AUTHENTICATE_TWOFACTOR))

export const setTwoFactorAuthenticationResult = createAction(SET_TWOFACTOR_AUTHENTICATION_RESULT)

export const {
  start: removeTwoFactor,
  success: removeTwoFactorSuccess,
  fail: removeTwoFactorFail,
  reset: removeTwoFactorReset,
} = defineLoopActions(
  REMOVE_TWOFACTOR,
  {
    failureMessage: 'Failed to remove two factor authentication.',
    successMessage: 'Two factor authentication was removed successfully.'
  }
)

export const {
  start: sendTwoFactorCodeBySMS,
  success: sendTwoFactorCodeBySMSSuccess,
  fail: sendTwoFactorCodeBySMSFail,
  reset: resetSendTwoFactorCode,
} = defineLoopActions(
  SEND_TWOFACTOR_CODE_BY_SMS,
  {
    failureMessage: 'Failed to send two factor code via SMS.',
    successMessage: 'Two factor code was sent via SMS.',
  }
)

export const {
  start: sendTwoFactorCodeByCall,
  success: sendTwoFactorCodeByCallSuccess,
  fail: sendTwoFactorCodeByCallFail,
} = defineLoopActions(
  SEND_TWOFACTOR_CODE_BY_CALL,
  {
    failureMessage: 'Failed to send two factor code via call.',
    successMessage: 'Two factor code was sent via phone call.'
  }
)

export const setTwoFactorPreference = createAction(SET_TWOFACTOR_PREFERENCE)

/* Reducer */

export const reducer = handleActions({

  /* Load two factor state */

  ...requestLoopHandlersForGet({
    action: GET_TWOFACTOR,
    dataField: 'twoFactor',
    getDataFromPayload: payload => payload.state,
  }),

  /* Add 2FA */

  ...requestLoopHandlersForUpdate({
    action: ADD_TWOFACTOR,
    stateField: 'addTwoFactorState',
  }),

  /* Reset 2FA-adding process */

  [RESET_TWOFACTOR_ADDING_PROCESS]: (state) => state.withMutations(map => {
    map.set('addTwoFactorState', REQUEST_STATUS.INITIAL)
    map.set('verifyCodeState', REQUEST_STATUS.INITIAL)
  }),

  /* Verify 2FA code */

  ...requestLoopHandlersForUpdate({
    action: VERIFY_TWOFACTOR,
    stateField: 'verifyCodeState',
  }),

  /* Set 2FA verification result */

  [SET_TWOFACTOR_VERIFICATION_RESULT]: (state, { payload }) => state.set('verifyCodeResult', payload),

  /* Authenticate 2FA code */

  ...requestLoopHandlersForGet({
    action: AUTHENTICATE_TWOFACTOR,
    dataField: 'twoFactorAuth',
    getDataFromPayload: payload => TwoFactorPayload(payload),
  }),

  /* Set 2FA authentication result */

  [SET_TWOFACTOR_AUTHENTICATION_RESULT]: (state, { payload }) => state.set('twoFactorAuthResult', payload),

  /* Remove 2FA */

  ...requestLoopHandlersForUpdate({
    action: REMOVE_TWOFACTOR,
    stateField: 'removeTwoFactorState',
  }),

  /* Send 2FA code by SMS */

  ...requestLoopHandlersForUpdate({
    action: SEND_TWOFACTOR_CODE_BY_SMS,
    stateField: 'sendCodeState',
  }),

  /* Send 2FA code by SMS */

  ...requestLoopHandlersForUpdate({
    action: SEND_TWOFACTOR_CODE_BY_CALL,
    stateField: 'sendCodeState',
  }),

  /* Set 2FA preference */

  [SET_TWOFACTOR_PREFERENCE]: (state, preference) => state.set('preference', preference),

  /* Data caching and persistence */

  ...createPersistenceHandlers('twofactor'),

}, initialState)
