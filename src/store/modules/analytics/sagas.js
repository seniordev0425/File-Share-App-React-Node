import { takeLatest, call, put } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
import {
  LOAD_ANALYTICS_PROVIDER_LIST,
  LOAD_ANALYTICS_PROFILE_LIST,
  LOAD_ANALYTICS_PROFILE,
  CREATE_ANALYTICS_PROFILE,
  UPDATE_ANALYTICS_PROFILE,
  DELETE_ANALYTICS_PROFILE,
} from './constants'
import {
  loadAnalyticsProviderListSuccess, loadAnalyticsProviderListFail,
  loadAnalyticsProfileSuccess, loadAnalyticsProfileFail,
  loadAnalyticsProfileListSuccess, loadAnalyticsProfileListFail, loadAnalyticsProfileListReset,
  createAnalyticsProfileSuccess, createAnalyticsProfileFail,
  updateAnalyticsProfileSuccess, updateAnalyticsProfileFail,
  deleteAnalyticsProfileSuccess, deleteAnalyticsProfileFail,
} from './reducer'


function* loadAnalyticsProviderList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/analytics/providers/list',
    successAction: loadAnalyticsProviderListSuccess,
    failAction: loadAnalyticsProviderListFail,
  }), action)
}

function* loadAnalyticsProfileList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/analytics/list',
    successAction: loadAnalyticsProfileListSuccess,
    failAction: loadAnalyticsProfileListFail,
  }), action)
}

function* loadAnalyticsProfile(action) {
  const { name } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/analytics/details/${name}`,
    successAction: loadAnalyticsProfileSuccess,
    failAction: loadAnalyticsProfileFail,
  }), action)
}

function* createAnalyticsProfile(action) {
  const { data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: '/analytics',
    data,
    successAction: createAnalyticsProfileSuccess,
    failAction: createAnalyticsProfileFail,
    beforeSuccessAction: function () {
      trackActivity('Create Analytics Profile', data)
    },
    afterSuccessAction: function* () {
      yield put(loadAnalyticsProfileListReset())
    },
  }), action)
}

function* updateAnalyticsProfile(action) {
  const { name, data } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/analytics/update/${name}`,
    data,
    successAction: updateAnalyticsProfileSuccess,
    failAction: updateAnalyticsProfileFail,
    beforeSuccessAction: function () {
      trackActivity('Update Analytics Profile', {
        name,
        ...data,
      })
    },
    afterSuccessAction: function* () {
      yield put(loadAnalyticsProfileListReset())
    },
  }), action)
}

function* deleteAnalyticsProfile(action) {
  const { name } = action.payload

  yield call(apiCallSaga({
    method: 'delete',
    route: `/analytics/${name}`,
    successAction: deleteAnalyticsProfileSuccess,
    failAction: deleteAnalyticsProfileFail,
    beforeSuccessAction: function () {
      trackActivity('Delete Analytics Profile', {
        name,
      })
    },
    afterSuccessAction: function* () {
      yield put(loadAnalyticsProfileListReset())
    },
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_ANALYTICS_PROVIDER_LIST, loadAnalyticsProviderList)
  yield takeLatest(LOAD_ANALYTICS_PROFILE_LIST, loadAnalyticsProfileList)
  yield takeLatest(LOAD_ANALYTICS_PROFILE, loadAnalyticsProfile)
  yield takeLatest(CREATE_ANALYTICS_PROFILE, createAnalyticsProfile)
  yield takeLatest(UPDATE_ANALYTICS_PROFILE, updateAnalyticsProfile)
  yield takeLatest(DELETE_ANALYTICS_PROFILE, deleteAnalyticsProfile)
}
