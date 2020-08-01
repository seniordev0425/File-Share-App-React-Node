import { createAction, handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_ALL_CHANGES_STATUS_LIST,
  LOAD_PRECACHE_STATUS_LIST,
  FLUSH_CACHE,
  PRECACHE,
  MANUAL_SYNC,
  RUN_STALE_CHANGES,
} from './constants'
import {
  ChangeStatus,
  PrecacheStatus,
  PrecacheJob,
  State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadAllChangesStatusList,
  success: loadAllChangesStatusListSuccess,
  fail: loadAllChangesStatusListFail,
} = defineLoopActions(
  LOAD_ALL_CHANGES_STATUS_LIST,
  {
    failureMessage: 'Failed to load the list of all status changes'
  }
)

export const {
  start: loadPrecacheStatusList,
  success: loadPrecacheStatusListSuccess,
  fail: loadPrecacheStatusListFail,
} = defineLoopActions(
  LOAD_PRECACHE_STATUS_LIST,
  {
    failureMessage: 'Failed to load precache status list.'
  }
)

export const {
  start: flushCache,
  success: flushCacheSuccess,
  fail: flushCacheFail,
} = defineLoopActions(
  FLUSH_CACHE,
  {
    failureMessage: 'Failed to request to sync from cloud storage.',
    successMessage: 'Sync from Cloud Storage request accepted.'
  }
)

export const {
  start: precache,
  success: precacheSuccess,
  fail: precacheFail,
} = defineLoopActions(
  PRECACHE,
  {
    failureMessage: 'Failed to request a push to CDN.',
    successMessage: 'Push to CDN request accepted.'
  }
)

export const manualSync = createAction(MANUAL_SYNC)

export const {
  start: runStaleChanges,
  success: runStaleChangesSuccess,
  fail: runStaleChangesFail,
} = defineLoopActions(
  RUN_STALE_CHANGES,
  {
    successMessage: 'Process stale changes request accepted.',
    failureMessage: 'Failed to request to process stale changes.',
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load All changes status list */

  ...requestLoopHandlersForGet({
    action: LOAD_ALL_CHANGES_STATUS_LIST,
    dataField: 'changeStatusList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.changes, ChangeStatus),
    usePagination: false,
  }),

  /* Load precache status list */

  ...requestLoopHandlersForGet({
    action: LOAD_PRECACHE_STATUS_LIST,
    dataField: 'precacheStatusList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.sessions, record => PrecacheStatus({
      ...record,
      current: PrecacheJob(record.current),
    })),
    usePagination: false,
  }),

  /* Flush cache */

  ...requestLoopHandlersForUpdate({
    action: FLUSH_CACHE,
    stateField: 'flushCacheRequestState',
  }),

  /* Precache */

  ...requestLoopHandlersForUpdate({
    action: PRECACHE,
    stateField: 'precacheRequestState',
  }),

  /* Run stale changes */

  ...requestLoopHandlersForUpdate({
    action: RUN_STALE_CHANGES,
    stateField: 'runStaleChangesState',
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('siteUpdates'),

}, initialState)
