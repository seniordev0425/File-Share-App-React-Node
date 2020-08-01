import { handleActions } from 'redux-actions'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_RECENT_SITE_STATS,
  LOAD_SITE_STATS,
  LOAD_SITE_MINI_GRAPH_STATS,
} from './constants'
import {
  SiteStatsRecord, SiteStats, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadRecentSiteStats,
  success: loadRecentSiteStatsSuccess,
  fail: loadRecentSiteStatsFail,
} = defineLoopActions(
  LOAD_RECENT_SITE_STATS,
  {
    failureMessage: 'Failed to load recent site stats.'
  }
)

export const {
  start: loadSiteStats,
  success: loadSiteStatsSuccess,
  fail: loadSiteStatsFail,
} = defineLoopActions(
  LOAD_SITE_STATS,
  {
    failureMessage: 'Failed to load site stats.'
  }
)

export const {
  start: loadSiteMiniGraphStats,
  success: loadSiteMiniGraphStatsSuccess,
  fail: loadSiteMiniGraphStatsFail,
} = defineLoopActions(
  LOAD_SITE_MINI_GRAPH_STATS,
  {
    failureMessage: 'Failed to load site mini graph stats.'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load recent site stats */

  ...requestLoopHandlersForGet({
    action: LOAD_RECENT_SITE_STATS,
    dataField: payload => ['recentSiteStatsMap', payload.server],
    getDataFromPayload: payload => SiteStats({
      ...payload,
      transfers: convertToListRecord(payload.transfers, SiteStatsRecord),
    }),
    preservePreviousState: true,
  }),

  /* Load site stats */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_STATS,
    dataField: payload => ['siteStatsMap', payload.server],
    getDataFromPayload: payload => SiteStats({
      ...payload,
      transfers: convertToListRecord(payload.transfers, SiteStatsRecord),
    }),
    preservePreviousState: true,
  }),

  /* Load site stats for mini graph */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_MINI_GRAPH_STATS,
    dataField: payload => ['siteMiniGraphStatsMap', payload.server],
    getDataFromPayload: payload => SiteStats({
      ...payload,
      transfers: convertToListRecord(payload.transfers, SiteStatsRecord),
    }),
    preservePreviousState: true,
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('siteStats'),

}, initialState)
