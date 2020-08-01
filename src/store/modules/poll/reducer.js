import { handleActions } from 'redux-actions'

import {
  defineLoopActions,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  POLL,
} from './constants'
import {
  PollResult, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: poll,
  success: pollSuccess,
  fail: pollFail,
} = defineLoopActions(
  POLL,
  {
    hideNotifications: true,
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load analytics profile list */

  ...requestLoopHandlersForGet({
    action: POLL,
    dataField: 'pollResult',
    initialValue: PollResult(),
    preservePreviousState: true,
    getDataFromPayload: (payload, state) => {
      let pollResult = state.getIn(['pollResult', 'data'], PollResult())
      if (payload.activity) {
        Object.keys(payload.activity).forEach(key => {
          const value = payload.activity[key]
          pollResult = pollResult.setIn(['activity', key], value)
        })
      }
      return pollResult
    },
    onSuccess: (record, payload, initialPayload) => {
      if (initialPayload.onSuccess) {
        initialPayload.onSuccess(payload, initialPayload)
      }
    },
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('poll'),

}, initialState)
