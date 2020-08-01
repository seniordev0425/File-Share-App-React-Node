import { takeLatest, call } from 'redux-saga/effects'
import moment from 'moment'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_ACCOUNT_STATS,
  LOAD_RECENT_ACCOUNT_STATS,
} from './constants'
import {
  loadAccountStatsSuccess, loadAccountStatsFail,
  loadRecentAccountStatsSuccess, loadRecentAccountStatsFail,
} from './reducer'


function* loadAccountStats(action) {
  const { start, end } = action.payload

  let url = '/stats/'
  url += `?start=${encodeURIComponent(moment(start).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  if (end) {
    url += `&end=${encodeURIComponent(moment(end).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC')}`
  }

  yield call(apiCallSaga({
    method: 'get',
    route: url,
    successAction: loadAccountStatsSuccess,
    failAction: loadAccountStatsFail,
  }), action)
}

function* loadRecentAccountStats(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/stats/recent',
    successAction: loadRecentAccountStatsSuccess,
    failAction: loadRecentAccountStatsFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_ACCOUNT_STATS, loadAccountStats)
  yield takeLatest(LOAD_RECENT_ACCOUNT_STATS, loadRecentAccountStats)
}
