import { throttle, call } from 'redux-saga/effects'

import { POLL_THROTTLE_SMALL } from 'constants/common'
import { apiCallSaga } from 'utils/apiCall'
import {
  POLL,
} from './constants'
import {
  pollSuccess,
  pollFail,
} from './reducer'


function* poll(action) {
  const {
    lastactivity,
    wait,
    updated,
  } = action.payload

  let route = '/activity/poll'
  if (updated) {
    route += '?updated'
  }

  yield call(apiCallSaga({
    method: 'get',
    route,
    config: {
      params: {
        lastactivity,
        wait: typeof(wait) === 'undefined' ? 55 : wait,
      },
    },
    successAction: pollSuccess,
    failAction: pollFail,
  }), action)
}

export const saga = function* () {
  yield throttle(POLL_THROTTLE_SMALL, POLL, poll)
}
