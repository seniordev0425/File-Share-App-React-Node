import { takeLatest, call } from 'redux-saga/effects'
import moment from 'moment'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_LOG_LIST,
} from './constants'
import {
  loadLogListSuccess, loadLogListFail,
} from './reducer'


function* loadLogList(action) {
  const { server, start, end } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: (
      `/log/${server}` +
      `?start=${moment(start).format('YYYY-MM-DD')}` +
      `&end=${moment(end).format('YYYY-MM-DD')}`
    ),
    successAction: loadLogListSuccess,
    failAction: loadLogListFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_LOG_LIST, loadLogList)
}
