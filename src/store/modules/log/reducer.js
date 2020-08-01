import { createAction, handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_LOG_LIST,
  SET_REPORTING_ERROR,
} from './constants'
import {
  Log, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadLogList,
  success: loadLogListSuccess,
  fail: loadLogListFail,
} = defineLoopActions(LOAD_LOG_LIST)

export const setReportingError = createAction(SET_REPORTING_ERROR)

/* Reducer */

export const reducer = handleActions({

  /* Load log list */

  ...requestLoopHandlersForGet({
    action: LOAD_LOG_LIST,
    dataField: 'logList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.records, Log),
    usePagination: false,
  }),

  /* Set reporting error */

  [SET_REPORTING_ERROR]: (state, { payload }) => state.set('reportingError', payload),

  /* Data caching and persistence */

  ...createPersistenceHandlers('log'),

}, initialState)
