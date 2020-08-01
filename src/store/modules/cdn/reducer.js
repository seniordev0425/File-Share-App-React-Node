import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_CDN_LIST,
} from './constants'
import {
  CDN, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadCDNList,
  success: loadCDNListSuccess,
  fail: loadCDNListFail,
} = defineLoopActions(
  LOAD_CDN_LIST,
  {
    failureMessage: 'Failed to load CDN list'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load CDN list */

  ...requestLoopHandlersForGet({
    action: LOAD_CDN_LIST,
    dataField: 'cdnList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.providers, CDN),
    usePagination: false,
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('cdn'),

}, initialState)
