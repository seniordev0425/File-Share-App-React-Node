import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForGetDetailMap,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
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
  Storage, StorageDetail, OAuthLink, OAuthResult, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadStorageList,
  success: loadStorageListSuccess,
  fail: loadStorageListFail,
} = defineLoopActions(
  LOAD_STORAGE_LIST,
  {
    failureMessage: 'Failed to load all the storage list.'
  }
)

export const {
  start: loadMyStorageList,
  success: loadMyStorageListSuccess,
  fail: loadMyStorageListFail,
  reset: loadMyStorageListReset,
} = defineLoopActions(
  LOAD_MY_STORAGE_LIST,
  {
    failureMessage: 'Failed to load your storage list.'
  }
)

export const {
  start: loadStorageDetail,
  success: loadStorageDetailSuccess,
  fail: loadStorageDetailFail,
} = defineLoopActions(
  LOAD_STORAGE_DETAIL,
  {
    failureMessage: 'Failed to load storage details.'
  }
)

export const {
  start: loadStorageDetailToMap,
  success: loadStorageDetailToMapSuccess,
  fail: loadStorageDetailToMapFail,
} = defineLoopActions(
  LOAD_STORAGE_DETAIL_TO_MAP,
  {
    failureMessage: 'Failed to load storage details.'
  }
)

export const {
  start: loadOAuthLink,
  success: loadOAuthLinkSuccess,
  fail: loadOAuthLinkFail,
  reset: loadOAuthLinkReset,
} = defineLoopActions(
  LOAD_OAUTH_LINK,
  {
    failureMessage: 'Failed to load OAuth link.'
  }
)

export const {
  start: processOAuthCode,
  success: processOAuthCodeSuccess,
  fail: processOAuthCodeFail,
  reset: processOAuthCodeReset,
} = defineLoopActions(
  PROCESS_OAUTH_CODE,
  {
    failureMessage: 'Failed to load OAuth link.'
  }
)

export const {
  start: unlinkStorage,
  success: unlinkStorageSuccess,
  fail: unlinkStorageFail,
  reset: unlinkStorageReset,
} = defineLoopActions(
  UNLINK_STORAGE,
  {
    failureMessage: 'Failed to load OAuth link.'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load storage list */

  ...requestLoopHandlersForGet({
    action: LOAD_STORAGE_LIST,
    dataField: 'storageList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.providers, Storage),
    usePagination: false,
  }),

  /* Load my storage list */

  ...requestLoopHandlersForGet({
    action: LOAD_MY_STORAGE_LIST,
    dataField: 'myStorageList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.providers, Storage),
    usePagination: false,
  }),

  /* Load storage detail */

  ...requestLoopHandlersForGet({
    action: LOAD_STORAGE_DETAIL,
    dataField: 'storageDetail',
    getDataFromPayload: payload => StorageDetail(payload.provider),
  }),

  /* Load storage detail to map */

  ...requestLoopHandlersForGetDetailMap({
    action: LOAD_STORAGE_DETAIL_TO_MAP,
    mapField: 'storageDetailMap',
    idField: 'storage',
    getDataFromPayload: payload => StorageDetail(payload.provider),
  }),

  /* Load oauth link */

  ...requestLoopHandlersForGet({
    action: LOAD_OAUTH_LINK,
    dataField: 'oauthLink',
    getDataFromPayload: payload => OAuthLink(payload),
  }),

  /* Process oauth code */

  ...requestLoopHandlersForGet({
    action: PROCESS_OAUTH_CODE,
    dataField: 'oauthResult',
    getDataFromPayload: payload => OAuthResult(payload),
  }),

  /* Unlink storage */

  ...requestLoopHandlersForUpdate({
    action: UNLINK_STORAGE,
    stateField: 'unlinkStorageState',
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('storage'),

}, initialState)
