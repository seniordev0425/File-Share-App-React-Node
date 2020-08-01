import { takeLatest, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { LOAD_SYSTEM_STATUS } from './constants'
import { loadSystemStatusSuccess, loadSystemStatusFail } from './reducer'


function* loadSystemStatus (action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/system/',
    successAction: loadSystemStatusSuccess,
    failAction: loadSystemStatusFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_SYSTEM_STATUS, loadSystemStatus)
}
