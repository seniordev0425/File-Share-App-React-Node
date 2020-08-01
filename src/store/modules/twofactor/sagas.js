import { call, race, select, takeLatest, put } from 'redux-saga/effects'
import { show as showModal } from 'redux-modal'

import { apiCallSaga, bindCallbackToPromise } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import { selectTwoFactorEnabled } from 'store/modules/user/selectors'
import {
  GET_TWOFACTOR,
  ADD_TWOFACTOR,
  VERIFY_TWOFACTOR,
  AUTHENTICATE_TWOFACTOR,
  REMOVE_TWOFACTOR,
  SEND_TWOFACTOR_CODE_BY_SMS,
  SEND_TWOFACTOR_CODE_BY_CALL,
} from './constants'
import {
  getTwoFactorSuccess, getTwoFactorFail,
  addTwoFactorSuccess, addTwoFactorFail,
  verifyTwoFactorSuccess, verifyTwoFactorFail, setTwoFactorVerificationResult,
  authenticateTwoFactorSuccess, authenticateTwoFactorFail, setTwoFactorAuthenticationResult,
  removeTwoFactorSuccess, removeTwoFactorFail, removeTwoFactorReset,
  sendTwoFactorCodeBySMSSuccess, sendTwoFactorCodeBySMSFail,
  sendTwoFactorCodeByCallSuccess, sendTwoFactorCodeByCallFail,
} from './reducer'


function* getTwoFactor(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/user/2factor',
    successAction: getTwoFactorSuccess,
    failAction: getTwoFactorFail,
  }), action)
}

function* addTwoFactor(action) {
  yield call(apiCallSaga({
    method: 'post',
    route: '/user/2factor',
    successAction: addTwoFactorSuccess,
    failAction: addTwoFactorFail,
    beforeSuccessAction: function () {
      trackActivity('Add 2FA')
    },
  }), action)
}

function* verifyTwoFactor(action) {
  const { code } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/user/2factor/verify/${code}`,
    successAction: verifyTwoFactorSuccess,
    failAction: function* (error) {
      let errorMessage
      switch (error.response.status) {
        case 406:
          errorMessage = 'Provided two-factor authentication code is invalid.'
          break
        default:
          errorMessage = 'Failed to verify two-factor authentication code.'
      }
      yield put(setTwoFactorVerificationResult(errorMessage))
      yield put(verifyTwoFactorFail(error.response.data))
    },
    beforeSuccessAction: function () {
      trackActivity('Verify added 2FA')
    },
  }), action)
}

function* authenticateTwoFactor(action) {
  const { code } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/user/2factor/auth/${code}`,
    successAction: authenticateTwoFactorSuccess,
    failAction: function* (error) {
      let errorMessage
      switch (error.response.status) {
        case 406:
          errorMessage = 'Provided two-factor authentication code is invalid.'
          break
        default:
          errorMessage = 'Failed to verify two-factor authentication code.'
      }
      yield put(setTwoFactorAuthenticationResult(errorMessage))
      yield put(authenticateTwoFactorFail(error.response.data))
    },
    beforeSuccessAction: function () {
      trackActivity('Authenticate 2FA')
    },
  }), action)
}

function* removeTwoFactor(action) {
  const code = yield get2FAToken()

  if (!code) {
    yield put(removeTwoFactorReset())
    return
  }

  yield call(apiCallSaga({
    method: 'delete',
    route: `/user/2factor/${code}`,
    successAction: removeTwoFactorSuccess,
    failAction: removeTwoFactorFail,
    resetAction: removeTwoFactorReset,
    beforeSuccessAction: function () {
      trackActivity('Remove 2FA')
    },
  }), action)
}

function* sendCodeBySMS(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/user/2factor/code',
    successAction: sendTwoFactorCodeBySMSSuccess,
    failAction: sendTwoFactorCodeBySMSFail,
    beforeSuccessAction: function () {
      trackActivity('Send 2FA Code by SMS')
    },
  }), action)
}

function* sendCodeByCall(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/user/2factor/call',
    successAction: sendTwoFactorCodeByCallSuccess,
    failAction: sendTwoFactorCodeByCallFail,
    beforeSuccessAction: function () {
      trackActivity('Send 2FA Code by Call')
    },
  }), action)
}

export const get2FAToken = function* () {
  const submitProm = bindCallbackToPromise()
  const closeProm = bindCallbackToPromise()
  yield put(
    showModal('twoFactorInputModal', {
      onSubmit: submitProm.cb,
      onClose: closeProm.cb,
    })
  )
  const result = yield race({
    submitted: call(submitProm.promise),
    closed: call(closeProm.promise)
  })
  return result.submitted ? result.submitted.code : null
}

export const attach2FATokenIfNeeded = function* (params) {
  const twoFactorEnabled = yield select(selectTwoFactorEnabled)
  if (twoFactorEnabled) {
    const token = yield get2FAToken()
    if (!token) {
      const error = Error('Two factor authentication has been canceled.')
      error.code = '2FA_CANCELED'
      throw error
    }
    return { ...params, token }
  } else {
    return params
  }
}

export const saga = function* () {
  yield takeLatest(GET_TWOFACTOR, getTwoFactor)
  yield takeLatest(ADD_TWOFACTOR, addTwoFactor)
  yield takeLatest(VERIFY_TWOFACTOR, verifyTwoFactor)
  yield takeLatest(AUTHENTICATE_TWOFACTOR, authenticateTwoFactor)
  yield takeLatest(REMOVE_TWOFACTOR, removeTwoFactor)
  yield takeLatest(SEND_TWOFACTOR_CODE_BY_SMS, sendCodeBySMS)
  yield takeLatest(SEND_TWOFACTOR_CODE_BY_CALL, sendCodeByCall)
}
