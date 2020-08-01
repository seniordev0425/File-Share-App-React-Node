import { takeEvery, put, delay } from 'redux-saga/effects'

import { NOTIFICATION_DISPLAY_TIME } from 'constants/common'
import { PUSH } from './constants'
import { pop } from './reducer'


function* delayedPop({ payload }) {
  if (!['danger', 'warning'].includes(payload.type)) {
    yield delay(NOTIFICATION_DISPLAY_TIME)

    yield put(pop())
  }
}

export const saga = function* () {
  yield takeEvery(PUSH, delayedPop)
}
