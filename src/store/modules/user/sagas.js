import { takeLatest, call, put } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOAD_USER_DETAIL,
  UPDATE_USER_DETAIL,
  CHECK_PASSWORD_CODE,
  SET_PASSWORD,
  RESET_PASSWORD,
  CLOSE_ACCOUNT,
} from './constants'
import {
  loadUserSuccess, loadUserFail,
  updateUserSuccess, updateUserFail,
  setUpdateUserLastError, updateUserReset,
  setPasswordSuccess, setPasswordFail,
  resetPasswordSuccess, resetPasswordFail,
  closeAccountSuccess, closeAccountFail,
  checkPasswordCodeSuccess, checkPasswordCodeFail,
  closeAccountReset,
} from './reducer'
import { attach2FATokenIfNeeded } from '../twofactor/sagas'

function* loadUserDetail(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/user/details',
    successAction: loadUserSuccess,
    failAction: loadUserFail,
  }), action)
}

function* updateUser(action) {
  const { data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: '/user',
    data,
    twoFactorTokenGenerator: attach2FATokenIfNeeded,
    checkFormErrors: true,
    successAction: updateUserSuccess,
    failAction: updateUserFail,
    resetAction: updateUserReset,
    beforeSuccessAction: function () {
      trackActivity('Update User Info', data)
    },
    afterErrorAction: function* (error) {
      let errorMessage
      switch (error.response.status) {
        case 409:
          errorMessage = 'Provided email address or phone number is not available.'
          break
        default:
          errorMessage = 'Failed to update user details.'
      }
      yield put(setUpdateUserLastError(errorMessage))
    },
  }), action)
}

function* checkPasswordCode(action) {
  const { code } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/user/password/email/${code}`,
    successAction: checkPasswordCodeSuccess,
    failAction: checkPasswordCodeFail,
  }), action)
}

function* setPassword(action) {
  const { code, data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/user/password/${code}`,
    data,
    successAction: setPasswordSuccess,
    failAction: setPasswordFail,
    beforeSuccessAction: function () {
      trackActivity('Update Password', {
        code,
        ...data,
      })
    },
  }), action)
}

function* resetPassword(action) {
  const { email_address } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/user/email/reset/${email_address}`,
    data: {
      email_address,
    },
    successAction: resetPasswordSuccess,
    failAction: resetPasswordFail,
    beforeSuccessAction: function () {
      trackActivity('Reset Password', {
        email_address,
      })
    },
  }), action)
}

function* closeAccount(action) {
  yield call(apiCallSaga({
    method: 'post',
    route: '/user/close',
    data: action.payload,
    twoFactorTokenGenerator: attach2FATokenIfNeeded,
    successAction: closeAccountSuccess,
    failAction: closeAccountFail,
    resetAction: closeAccountReset,
    beforeSuccessAction: function () {
      trackActivity('Close Account')
    },
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_USER_DETAIL, loadUserDetail)
  yield takeLatest(UPDATE_USER_DETAIL, updateUser)
  yield takeLatest(CLOSE_ACCOUNT, closeAccount)
  yield takeLatest(CHECK_PASSWORD_CODE, checkPasswordCode)
  yield takeLatest(SET_PASSWORD, setPassword)
  yield takeLatest(RESET_PASSWORD, resetPassword)
}
