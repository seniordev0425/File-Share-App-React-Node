import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_DOMAIN_LIST,
} from './constants'
import {
  Domain, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadDomainList,
  success: loadDomainListSuccess,
  fail: loadDomainListFail,
} = defineLoopActions(
  LOAD_DOMAIN_LIST,
  {
    failureMessage: 'Failed to load domain list'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load analytics profile list */

  ...requestLoopHandlersForGet({
    action: LOAD_DOMAIN_LIST,
    dataField: 'domainList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.domains, Domain),
    usePagination: false,
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('domains'),

}, initialState)
