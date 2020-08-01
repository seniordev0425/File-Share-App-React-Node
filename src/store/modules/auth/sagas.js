import { takeEvery, takeLatest, call, put } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOGIN,
  LOAD_KEY_LIST,
  CREATE_KEY,
  DELETE_KEY,
} from './constants'
import {
  loginSuccess, loginFail,
  loadKeyList as loadKeyListAction, loadKeyListSuccess, loadKeyListFail,
  createKeySuccess, createKeyFail,
  deleteKeySuccess, deleteKeyFail,
} from './reducer'


function* login(action) {
  const { username, password } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: '/user/token',
    config: {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      }
    },
    noRetry: true,
    checkFormErrors: true,
    successAction: loginSuccess,
    failAction: loginFail,
    beforeSuccessAction: function () {
      trackActivity('Login', {
        username,
      })
    },
  }), action)
}

function* loadKeyList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/user/keys',
    successAction: loadKeyListSuccess,
    failAction: loadKeyListFail,
  }), action)
}

function* createKey(action) {
  const { memo } = action.payload.data

  yield call(apiCallSaga({
    method: 'post',
    route: '/user/key',
    data: {
      memo,
    },
    successAction: createKeySuccess,
    failAction: createKeyFail,
    beforeSuccessAction: function () {
      trackActivity('Create API Key', {
        memo,
      })
    },
    afterSuccessAction: function* () {
      yield put(loadKeyListAction())
    },
  }), action)
}

function* deleteKey(action) {
  const { id } = action.payload

  yield call(apiCallSaga({
    method: 'delete',
    route: `/user/key/${id}`,
    successAction: deleteKeySuccess,
    failAction: deleteKeyFail,
    beforeSuccessAction: function () {
      trackActivity('Delete API Key', {
        id,
      })
    },
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOGIN, login)
  yield takeLatest(LOAD_KEY_LIST, loadKeyList)
  yield takeLatest(CREATE_KEY, createKey)
  yield takeEvery(DELETE_KEY, deleteKey)
}
