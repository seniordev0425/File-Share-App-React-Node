import { takeEvery, takeLatest, call, put } from 'redux-saga/effects'
import { show as showModal } from 'redux-modal'
import _intersection from 'lodash/intersection'

import { apiCallSaga, bindCallbackToPromise } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOAD_SITE_LIST,
  LOAD_SITE_DETAIL,
  LOAD_SITE_PREVIEW,
  CREATE_SITE,
  UPDATE_SITE_DETAIL,
  DELETE_SITE_DETAIL,
} from './constants'
import {
  loadSiteList as loadSiteListAction, loadSiteListSuccess, loadSiteListFail,
  loadSiteDetailSuccess, loadSiteDetailFail,
  loadSitePreviewSuccess, loadSitePreviewFail,
  createSiteSuccess, createSiteFail,
  updateSiteDetailSuccess, updateSiteDetailFail, updateSiteDetailReset,
  deleteSiteDetailSuccess, deleteSiteDetailFail, deleteSiteDetailReset,
} from './reducer'
import { attach2FATokenIfNeeded } from '../twofactor/sagas'


export function* confirmFullSiteResync() {
  const submitPromise = bindCallbackToPromise()
  yield put(
    showModal('fullSiteResyncConfirmModal', {
      onSubmit: submitPromise.cb,
    })
  )
  return yield call(submitPromise.promise)
}

function* loadSiteList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/server/list?nodeleted',
    successAction: loadSiteListSuccess,
    failAction: loadSiteListFail,
  }), action)
}

function* loadSiteDetail(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/server/details/${server}`,
    successAction: loadSiteDetailSuccess,
    failAction: loadSiteDetailFail,
  }), action)
}

function* loadSitePreview(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/server/preview/${server}`,
    successAction: loadSitePreviewSuccess,
    failAction: function* (error) {
      yield put(loadSitePreviewFail({
        error,
        server,
      }), action)
    },
  }), action)
}

function* createSite(action) {
  const { data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: '/server',
    data,
    successAction: createSiteSuccess,
    failAction: createSiteFail,
    beforeSuccessAction: function () {
      trackActivity('Create Server', data)
    },
    afterSuccessAction: function* () {
      yield put(loadSiteListAction())
    },
  }), action)
}

function* updateSiteDetail(action) {
  const { server, data } = action.payload
  const fieldsToCauseResync = [
    'email_obfs', 'fancyindexing', 'filter_mode', 'filter',
    'image_mirage', 'image_polish', 'indexfiles',
    'minify_css', 'minify_html', 'minify_js', 'password', 'scrape_shield',
  ]

  if (_intersection(Object.keys(data), fieldsToCauseResync).length > 0) {
    const confirmed = yield confirmFullSiteResync()
    if (!confirmed) {
      yield put(updateSiteDetailReset())
      return
    }
  }

  yield call(apiCallSaga({
    method: 'post',
    route: `/server/update/${server}`,
    data,
    successAction: updateSiteDetailSuccess,
    failAction: updateSiteDetailFail,
    beforeSuccessAction: function () {
      trackActivity('Update Server', {
        server,
        ...data,
      })
    },
  }), action)
}

function* deleteSiteDetail(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'delete',
    route: `/server/${server}`,
    twoFactorTokenGenerator: attach2FATokenIfNeeded,
    successAction: deleteSiteDetailSuccess,
    failAction: deleteSiteDetailFail,
    resetAction: deleteSiteDetailReset,
    beforeSuccessAction: function () {
      trackActivity('Delete Server', {
        server,
      })
    },
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_SITE_LIST, loadSiteList)
  yield takeLatest(LOAD_SITE_DETAIL, loadSiteDetail)
  yield takeEvery(LOAD_SITE_PREVIEW, loadSitePreview)
  yield takeLatest(CREATE_SITE, createSite)
  yield takeEvery(UPDATE_SITE_DETAIL, updateSiteDetail)
  yield takeLatest(DELETE_SITE_DETAIL, deleteSiteDetail)
}
