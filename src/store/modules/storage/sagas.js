import { takeLatest, takeEvery, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOAD_STORAGE_LIST,
  LOAD_MY_STORAGE_LIST,
  LOAD_STORAGE_DETAIL,
  LOAD_STORAGE_DETAIL_TO_MAP,
  LOAD_OAUTH_LINK,
  PROCESS_OAUTH_CODE,
  UNLINK_STORAGE,
} from './constants'
import {
  loadStorageListSuccess, loadStorageListFail,
  loadMyStorageListSuccess, loadMyStorageListFail, loadMyStorageListReset,
  loadStorageDetailSuccess, loadStorageDetailFail,
  loadStorageDetailToMapSuccess, loadStorageDetailToMapFail,
  loadOAuthLinkSuccess, loadOAuthLinkFail,
  processOAuthCodeSuccess, processOAuthCodeFail,
  unlinkStorageSuccess, unlinkStorageFail, unlinkStorageReset,
} from './reducer'
import { attach2FATokenIfNeeded } from '../twofactor/sagas'


function* loadOauthLink(action) {
  const { storage } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/storage/link/${storage}`,
    successAction: loadOAuthLinkSuccess,
    failAction: loadOAuthLinkFail,
  }), action)
}

function* processOAuthCode(action) {
  const { storage, data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/storage/link/${storage}`,
    data,
    successAction: processOAuthCodeSuccess,
    failAction: processOAuthCodeFail,
    beforeSuccessAction: function () {
      trackActivity('Link Storage', {
        storage,
        ...data,
      })
    },
  }), action)
}

function* loadStorageList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/storage/providers/list',
    successAction: loadStorageListSuccess,
    failAction: loadStorageListFail,
  }), action)
}

function* loadMyStorageList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/storage/providers/list/linked',
    successAction: loadMyStorageListSuccess,
    failAction: loadMyStorageListFail,
  }), action)
}

function* loadStorageDetail(action) {
  const { storage } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/storage/providers/details/${storage}`,
    successAction: loadDetailSuccess,
    failAction: loadStorageDetailFail,
  }), action)
}

function* loadStorageDetailToMap(action) {
  const { storage } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    idField: 'storage',
    route: `/storage/providers/details/${storage}?user=yes`,
    successAction: loadStorageDetailToMapSuccess,
    failAction: loadStorageDetailToMapFail,
  }), action)
}

function* unlinkStorage(action) {
  const { storage } = action.payload

  yield call(apiCallSaga({
    method: 'delete',
    route: `/storage/providers/${storage}`,
    twoFactorTokenGenerator: attach2FATokenIfNeeded,
    successAction: unlinkStorageSuccess,
    failAction: unlinkStorageFail,
    resetAction: unlinkStorageReset,
    beforeSuccessAction: function () {
      trackActivity('Unlink Storage', {
        storage,
      })
    },
    afterSuccessAction: loadMyStorageListReset,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_STORAGE_LIST, loadStorageList)
  yield takeLatest(LOAD_MY_STORAGE_LIST, loadMyStorageList)
  yield takeLatest(LOAD_STORAGE_DETAIL, loadStorageDetail)
  yield takeEvery(LOAD_STORAGE_DETAIL_TO_MAP, loadStorageDetailToMap)
  yield takeLatest(LOAD_OAUTH_LINK, loadOauthLink)
  yield takeLatest(PROCESS_OAUTH_CODE, processOAuthCode)
  yield takeLatest(UNLINK_STORAGE, unlinkStorage)
}
