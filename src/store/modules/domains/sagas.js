import { takeLatest, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_DOMAIN_LIST,
} from './constants'
import {
  loadDomainListSuccess, loadDomainListFail,
} from './reducer'


function* loadDomainList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/domain/list',
    successAction: loadDomainListSuccess,
    failAction: loadDomainListFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_DOMAIN_LIST, loadDomainList)
}
