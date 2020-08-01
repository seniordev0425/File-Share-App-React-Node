import { takeLatest, call } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import {
  LOAD_PATH_DETAILS,
  LOAD_ROOT_DETAILS,
  LOAD_FOLDER_CONTENT,
} from './constants'
import {
  loadPathDetailsSuccess, loadPathDetailsFail,
  loadRootDetailsSuccess, loadRootDetailsFail,
  loadFolderContentSuccess, loadFolderContentFail,
} from './reducer'


function* loadPathDetails(action) {
  const { server, path } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/server/details/${server}?${path}`,
    successAction: loadPathDetailsSuccess,
    failAction: loadPathDetailsFail,
  }), action)
}

function* loadRootDetails(action) {
  const { server } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/server/details/${server}?/`,
    successAction: loadRootDetailsSuccess,
    failAction: loadRootDetailsFail,
  }), action)
}

function* loadFolderContent(action) {
  const { server, path } = action.payload

  yield call(apiCallSaga({
    method: 'get',
    route: `/server/list/${server}?${path}`,
    successAction: loadFolderContentSuccess,
    failAction: loadFolderContentFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_PATH_DETAILS, loadPathDetails)
  yield takeLatest(LOAD_ROOT_DETAILS, loadRootDetails)
  yield takeLatest(LOAD_FOLDER_CONTENT, loadFolderContent)
}
