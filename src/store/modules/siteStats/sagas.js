import { takeEvery, call, put } from 'redux-saga/effects'
import moment from 'moment'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_RECENT_SITE_STATS,
  LOAD_SITE_STATS,
  LOAD_SITE_MINI_GRAPH_STATS,
} from './constants'
import {
  loadRecentSiteStatsSuccess, loadRecentSiteStatsFail,
  loadSiteStatsSuccess, loadSiteStatsFail,
  loadSiteMiniGraphStatsSuccess, loadSiteMiniGraphStatsFail,
} from './reducer'


function* loadRecentSiteStats(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/stats/server/recent/${server}`,
    successAction: loadRecentSiteStatsSuccess,
    failAction: function* (error) {
      yield put(loadRecentSiteStatsFail({
        error,
        server,
      }), action)
    },
  }), action)
}

function* loadSiteStats(action) {
  const { server, start, end } = action.payload
  let route = `/stats/server/${server}`
  route += `?start=${encodeURIComponent(moment(start).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  if (end) {
    route += `&end=${encodeURIComponent(moment(end).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  }

  yield call(apiCallSaga({
    method: 'get',
    route,
    successAction: loadSiteStatsSuccess,
    failAction: function* (error) {
      yield put(loadSiteStatsFail({
        error,
        server,
      }), action)
    },
  }), action)
}

function* loadSiteMiniGraphStats(action) {
  const { server } = action.payload

  const start = new Date()
  const end = new Date(start)
  start.setDate(start.getDate() - 7)
  let route = `/stats/server/${server}`
  route += `?start=${encodeURIComponent(moment(start).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  if (end) {
    route += `&end=${encodeURIComponent(moment(end).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  }

  yield call(apiCallSaga({
    method: 'get',
    route,
    successAction: loadSiteMiniGraphStatsSuccess,
    failAction: function* (error) {
      yield put(loadSiteMiniGraphStatsFail({
        error,
        server,
      }), action)
    },
  }), action)
}

export const saga = function* () {
  yield takeEvery(LOAD_RECENT_SITE_STATS, loadRecentSiteStats)
  yield takeEvery(LOAD_SITE_STATS, loadSiteStats)
  yield takeEvery(LOAD_SITE_MINI_GRAPH_STATS, loadSiteMiniGraphStats)
}
