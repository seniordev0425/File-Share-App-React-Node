import { createAction, handleActions } from 'redux-actions'

import {
  defineLoopActions,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_SYSTEM_STATUS,
  UPDATE_CACHED_VERSION,
} from './constants'
import { SystemStatus, State } from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadSystemStatus,
  success: loadSystemStatusSuccess,
  fail: loadSystemStatusFail,
} = defineLoopActions(
  LOAD_SYSTEM_STATUS,
  {
    failureMessage: 'Failed to load system status.'
  }
)

export const updateCachedVersion = createAction(UPDATE_CACHED_VERSION)

/* Reducer */

export const reducer = handleActions({

  /* Load system status */

  ...requestLoopHandlersForGet({
    action: LOAD_SYSTEM_STATUS,
    dataField: 'systemStatusData',
    preservePreviousState: true,
    getDataFromPayload: payload => SystemStatus({
      ...payload.platform,
      frontEndVersion: payload.frontend.version,
    }),
  }),

  [UPDATE_CACHED_VERSION]: (state, { payload: version }) => state.set('cachedVersion', version),

  /* Data caching and persistence */

  ...createPersistenceHandlers('system'),

}, initialState)
