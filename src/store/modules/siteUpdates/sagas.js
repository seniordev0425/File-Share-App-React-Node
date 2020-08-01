import { takeLatest, throttle, put, call } from 'redux-saga/effects'
import { show as showModal } from 'redux-modal'

import { apiCallSaga, bindCallbackToPromise } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOAD_ALL_CHANGES_STATUS_LIST,
  LOAD_PRECACHE_STATUS_LIST,
  FLUSH_CACHE,
  PRECACHE,
  MANUAL_SYNC,
  RUN_STALE_CHANGES,
} from './constants'
import {
  loadAllChangesStatusListSuccess, loadAllChangesStatusListFail,
  loadPrecacheStatusListSuccess, loadPrecacheStatusListFail,
  flushCacheSuccess, flushCacheFail,
  precacheSuccess, precacheFail,
  runStaleChangesSuccess, runStaleChangesFail,
} from './reducer'


function* loadAllChangesStatusList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/server/changes/status/',
    successAction: loadAllChangesStatusListSuccess,
    failAction: loadAllChangesStatusListFail,
  }), action)
}

function* loadPrecacheStatusList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/server/precache/status/',
    successAction: loadPrecacheStatusListSuccess,
    failAction: loadPrecacheStatusListFail,
  }), action)
}

function* flushCache(action) {
  const { server, path } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/server/flush/${server}?${path}`,
    successAction: flushCacheSuccess,
    failAction: flushCacheFail,
  }), action)
}

function* precache(action) {
  const { server, path } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/server/precache/${server}?${path}`,
    successAction: precacheSuccess,
    failAction: precacheFail,
    beforeSuccessAction: function () {
      trackActivity('Push to CDN', {
        server,
        path,
      })
    }
  }), action)
}

function* confirmManualSync() {
  const submitPromise = bindCallbackToPromise()
  yield put(
    showModal('manualSyncModal', {
      onSubmit: submitPromise.cb,
    })
  )
  return yield call(submitPromise.promise)
}

function* manualSync(action) {
  const { server, path } = action.payload
  const confirmed = yield confirmManualSync()
  if (confirmed) {
    trackActivity('Manual Sync', {
      server,
      path,
    })

    yield flushCache({
      payload: { server, path },
    })
  }
}

function* runStaleChanges(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/server/changes/runstale/${server}`,
    successAction: runStaleChangesSuccess,
    failAction: runStaleChangesFail,
    beforeSuccessAction: function () {
      trackActivity('Run Stale Changes', {
        server,
      })
    }
  }), action)
}

export const saga = function* () {
  yield throttle(1000, LOAD_ALL_CHANGES_STATUS_LIST, loadAllChangesStatusList)
  yield throttle(1000, LOAD_PRECACHE_STATUS_LIST, loadPrecacheStatusList)
  yield takeLatest(FLUSH_CACHE, flushCache)
  yield takeLatest(PRECACHE, precache)
  yield takeLatest(MANUAL_SYNC, manualSync)
  yield takeLatest(RUN_STALE_CHANGES, runStaleChanges)
}
