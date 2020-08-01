import { handleActions } from 'redux-actions'

import {
  defineLoopActions,
  requestLoopHandlersForGet,
  convertToListRecord,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_ACCOUNT_STATS,
  LOAD_RECENT_ACCOUNT_STATS,
} from './constants'
import {
  AccountStatsRecord, AccountStats, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadAccountStats,
  success: loadAccountStatsSuccess,
  fail: loadAccountStatsFail,
} = defineLoopActions(
  LOAD_ACCOUNT_STATS,
  {
    failureMessage: 'Failed to load account stats'
  }
)

export const {
  start: loadRecentAccountStats,
  success: loadRecentAccountStatsSuccess,
  fail: loadRecentAccountStatsFail,
} = defineLoopActions(
  LOAD_RECENT_ACCOUNT_STATS,
  {
    failureMessage: 'Failed to load recent account stats'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load account stats */

  ...requestLoopHandlersForGet({
    action: LOAD_ACCOUNT_STATS,
    dataField: 'accountStats',
    getDataFromPayload: payload => AccountStats({
      ...payload,
      transfers: convertToListRecord(payload.transfers, AccountStatsRecord),
    }),
    preservePreviousState: true,
  }),

  /* Load account stats */

  ...requestLoopHandlersForGet({
    action: LOAD_RECENT_ACCOUNT_STATS,
    dataField: 'recentAccountStats',
    getDataFromPayload: payload => AccountStats({
      ...payload,
      transfers: convertToListRecord(payload.transfers, AccountStatsRecord),
    }),
    preservePreviousState: true,
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('accountStats'),

}, initialState)
