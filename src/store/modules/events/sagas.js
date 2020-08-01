import { takeLatest, takeEvery, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_EVENT_LIST,
  LOAD_NOTIFICATION_LIST,
  LOAD_SITE_EVENT_LIST,
  ACKNOWLEDGE_EVENT,
  ACKNOWLEDGE_ALL_SITE_EVENTS,
} from './constants'
import {
  loadEventListSuccess, loadEventListFail,
  loadNotificationListSuccess, loadNotificationListFail,
  loadSiteEventListSuccess, loadSiteEventListFail,
  acknowledgeEventSuccess, acknowledgeEventFail,
  acknowledgeAllSiteEventsSuccess, acknowledgeAllSiteEventsFail,
} from './reducer'


function* loadEventList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/events',
    successAction: loadEventListSuccess,
    failAction: loadEventListFail,
  }), action)
}

function* loadNotificationList(action) {
  const { limit } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/events?limit=${limit}`,
    successAction: loadNotificationListSuccess,
    failAction: loadNotificationListFail,
  }), action)
}

function* loadSiteEventList(action) {
  const { limit, server } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/events/${server}?limit=${limit}`,
    successAction: loadSiteEventListSuccess,
    failAction: loadSiteEventListFail,
  }), action)
}

function* acknowledgeEvent(action) {
  const { eid } = action.payload || {}

  yield call(apiCallSaga({
    method: 'post',
    route: '/events/ack' + (eid ? `/${eid}` : ''),
    successAction: acknowledgeEventSuccess,
    failAction: acknowledgeEventFail,
  }), action)
}

function* acknowledgeAllSiteEvents(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: `/events/ack/server/${server}`,
    successAction: acknowledgeAllSiteEventsSuccess,
    failAction: acknowledgeAllSiteEventsFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_EVENT_LIST, loadEventList)
  yield takeLatest(LOAD_NOTIFICATION_LIST, loadNotificationList)
  yield takeLatest(LOAD_SITE_EVENT_LIST, loadSiteEventList)
  yield takeEvery(ACKNOWLEDGE_EVENT, acknowledgeEvent)
  yield takeEvery(ACKNOWLEDGE_ALL_SITE_EVENTS, acknowledgeAllSiteEvents)
}
