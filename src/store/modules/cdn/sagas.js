import { takeLatest, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_CDN_LIST,
} from './constants'
import {
  loadCDNListSuccess, loadCDNListFail,
} from './reducer'


function* loadCDNList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/cdn/providers/list',
    successAction: loadCDNListSuccess,
    failAction: loadCDNListFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_CDN_LIST, loadCDNList)
}
