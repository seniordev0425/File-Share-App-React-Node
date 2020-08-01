import { Map } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { requestSuccess } from 'utils/state'
import {
  POLL,
} from './constants'
import {
  PollResult, State,
} from './models'
import { reducer } from './reducer'


const initialState = State({
  pollResult: DetailData({
    data: PollResult({
      activity: Map({
        analytics: '2018-11-01 10:30:10 UTC',
        apikey: '2018-11-01 10:30:10 UTC',
        billing: '2018-11-01 10:30:10 UTC',
        cdns: '2018-11-01 10:30:10 UTC',
        changes: '2018-11-01 10:30:10 UTC',
        events: '2018-11-01 10:30:10 UTC',
        flush: '2018-11-01 10:30:10 UTC',
        precache: '2018-11-01 10:30:10 UTC',
        servers: '2018-11-01 10:30:10 UTC',
        storage: '2018-11-01 10:30:10 UTC',
        user: '2018-11-01 10:30:10 UTC'
      }),
    }),
  }),
})

it('poll success handler should set result data properly', () => {
  const initialPayload = {
    lastactivity: '2018-11-01 10:30:10 UTC',
    wait: 55,
    updated: true,
    onSuccess: jest.fn(),
  }

  // Set initial payload by calling pending action
  reducer(initialState, {
    type: POLL,
    payload: initialPayload,
  })

  // Process success action
  const successPayload = {
    result: true,
    results: 10,
    activity: {
      events: '2018-11-03 05:30:10 UTC',
      flush: '2018-11-03 05:30:10 UTC',
      precache: '2018-11-03 05:30:10 UTC',
    }
  }
  const nextState = reducer(initialState, {
    type: requestSuccess(POLL),
    payload: successPayload,
  })

  expect(nextState.pollResult.state).toEqual(REQUEST_STATUS.SUCCESS)
  expect(nextState.pollResult.data.toJS()).toEqual({
    activity: {
      analytics: '2018-11-01 10:30:10 UTC',
      apikey: '2018-11-01 10:30:10 UTC',
      billing: '2018-11-01 10:30:10 UTC',
      cdns: '2018-11-01 10:30:10 UTC',
      changes: '2018-11-01 10:30:10 UTC',
      events: '2018-11-03 05:30:10 UTC',
      flush: '2018-11-03 05:30:10 UTC',
      precache: '2018-11-03 05:30:10 UTC',
      servers: '2018-11-01 10:30:10 UTC',
      storage: '2018-11-01 10:30:10 UTC',
      user: '2018-11-01 10:30:10 UTC'
    },
  })
  expect(initialPayload.onSuccess).toHaveBeenCalledWith(successPayload, initialPayload)
})

it('poll success handler should keep result data when activity returned null', () => {
  // Set initial payload by calling pending action
  reducer(initialState, {
    type: POLL,
    payload: {
      activity: null,
    },
  })

  const nextState = reducer(initialState, {
    type: requestSuccess(POLL),
    payload: {
      result: true,
      results: 10,
      activity: null
    }
  })

  expect(nextState.pollResult.state).toEqual(REQUEST_STATUS.SUCCESS)
  expect(nextState.pollResult.data.toJS()).toEqual({
    activity: initialState.pollResult.data.activity.toJS(),
  })
})

it('poll action should keep result data when action started', () => {
  // Set initial payload by calling pending action
  const nextState = reducer(initialState, {
    type: POLL,
    payload: {
      activity: null,
    },
  })

  expect(nextState.pollResult.data.toJS()).toEqual({
    activity: initialState.pollResult.data.activity.toJS(),
  })
})
