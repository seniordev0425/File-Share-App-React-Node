import { handleActions } from 'redux-actions'
import { List } from 'immutable'
import moment from 'moment'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_EVENT_LIST,
  LOAD_NOTIFICATION_LIST,
  LOAD_SITE_EVENT_LIST,
  ACKNOWLEDGE_EVENT,
  ACKNOWLEDGE_ALL_SITE_EVENTS,
} from './constants'
import {
  Event, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadEventList,
  success: loadEventListSuccess,
  fail: loadEventListFail,
} = defineLoopActions(
  LOAD_EVENT_LIST,
  {
    failureMessage: 'Failed to load event list'
  }
)

export const {
  start: loadNotificationList,
  success: loadNotificationListSuccess,
  fail: loadNotificationListFail,
} = defineLoopActions(
  LOAD_NOTIFICATION_LIST,
  {
    failureMessage: 'Failed to load notification list.'
  }
)

export const {
  start: loadSiteEventList,
  success: loadSiteEventListSuccess,
  fail: loadSiteEventListFail,
} = defineLoopActions(
  LOAD_SITE_EVENT_LIST,
  {
    failureMessage: 'Failed to load site event list.'
  }
)

export const {
  start: acknowledgeEvent,
  success: acknowledgeEventSuccess,
  fail: acknowledgeEventFail,
} = defineLoopActions(
  ACKNOWLEDGE_EVENT,
  {
    failureMessage: 'Failed to acknowledge event.'
  }
)

export const {
  start: acknowledgeAllSiteEvents,
  success: acknowledgeAllSiteEventsSuccess,
  fail: acknowledgeAllSiteEventsFail,
} = defineLoopActions(
  ACKNOWLEDGE_ALL_SITE_EVENTS,
  {
    failureMessage: 'Failed to acknowlege all site events.'
  }
)

/* Reducer */

const setAsAcknowledged = (record, listFieldName, eid) => {
  if (!eid) {
    for (let i = 0; i < record[listFieldName].data.size; i += 1) {
      if (!record.getIn([listFieldName, 'data', i, 'acknowledged'])) {
        record.setIn(
          [listFieldName, 'data', i, 'acknowledged'],
          moment().utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'
        )
      }
    }
  } else {
    const index = record[listFieldName].data ?
      record[listFieldName].data.findIndex(event => event.eid === eid) : -1
    if (index >= 0 && !record.getIn([listFieldName, 'data', index, 'acknowledged'])) {
      record.setIn(
        [listFieldName, 'data', index, 'acknowledged'],
        moment().utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'
      )
    }
  }
}

export const reducer = handleActions({

  /* Load event list */

  ...requestLoopHandlersForGet({
    action: LOAD_EVENT_LIST,
    dataField: 'eventList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.events, Event),
    usePagination: false,
  }),

  /* Load notification list */

  ...requestLoopHandlersForGet({
    action: LOAD_NOTIFICATION_LIST,
    dataField: 'notificationList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.events, Event),
    usePagination: false,
  }),

  /* Load site event list */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_EVENT_LIST,
    dataField: 'siteEventList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.events, Event),
    usePagination: false,
  }),

  /* Acknowledge event */

  ...requestLoopHandlersForUpdate({
    action: ACKNOWLEDGE_EVENT,
    stateField: 'acknowledgeEventState',
    onInitial: (record, payload) => {
      const { eid } = payload || {}
      setAsAcknowledged(record, 'eventList', eid)
      setAsAcknowledged(record, 'notificationList', eid)
    }
  }),

  /* Acknowledge all site events */

  ...requestLoopHandlersForUpdate({
    action: ACKNOWLEDGE_ALL_SITE_EVENTS,
    stateField: 'acknowledgeEventState',
    onInitial: record => {
      setAsAcknowledged(record, 'siteEventList')
      record.siteEventList.data && record.siteEventList.data.forEach(event => (
        setAsAcknowledged(record, 'notificationList', event.eid)
      ))
    }
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('events'),

}, initialState)
