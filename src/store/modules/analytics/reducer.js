import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_ANALYTICS_PROVIDER_LIST,
  LOAD_ANALYTICS_PROFILE_LIST,
  LOAD_ANALYTICS_PROFILE,
  CREATE_ANALYTICS_PROFILE,
  UPDATE_ANALYTICS_PROFILE,
  DELETE_ANALYTICS_PROFILE,
} from './constants'
import {
  AnalyticsProvider, AnalyticsProfile, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadAnalyticsProviderList,
  success: loadAnalyticsProviderListSuccess,
  fail: loadAnalyticsProviderListFail,
} = defineLoopActions(
  LOAD_ANALYTICS_PROVIDER_LIST,
  {
    failureMessage: 'Failed to load analytics provider list'
  }
)

export const {
  start: loadAnalyticsProfile,
  success: loadAnalyticsProfileSuccess,
  fail: loadAnalyticsProfileFail,
} = defineLoopActions(
  LOAD_ANALYTICS_PROFILE,
  {
    failureMessage: 'Failed to load analytics profile'
  }
)

export const {
  start: loadAnalyticsProfileList,
  success: loadAnalyticsProfileListSuccess,
  fail: loadAnalyticsProfileListFail,
  reset: loadAnalyticsProfileListReset,
} = defineLoopActions(
  LOAD_ANALYTICS_PROFILE_LIST,
  {
    failureMessage: 'Failed to load analytics profile list'
  }
)

export const {
  start: createAnalyticsProfile,
  success: createAnalyticsProfileSuccess,
  fail: createAnalyticsProfileFail,
} = defineLoopActions(
  CREATE_ANALYTICS_PROFILE,
  {
    successMessage: 'Analytics profile was successfully created.',
    failureMessage: 'Failed to create a new Analytics profile.'
  }
)

export const {
  start: updateAnalyticsProfile,
  success: updateAnalyticsProfileSuccess,
  fail: updateAnalyticsProfileFail,
} = defineLoopActions(
  UPDATE_ANALYTICS_PROFILE,
  {
    successMessage: 'Analytics profile was successfully updated.',
    failureMessage: 'Failed to update analytics profile.'
  }
)

export const {
  start: deleteAnalyticsProfile,
  success: deleteAnalyticsProfileSuccess,
  fail: deleteAnalyticsProfileFail,
} = defineLoopActions(
  DELETE_ANALYTICS_PROFILE,
  {
    successMessage: 'Analytics profile was successfully deleted.',
    failureMessage: 'Failed to delete analytics profile.'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load analytics provider list */

  ...requestLoopHandlersForGet({
    action: LOAD_ANALYTICS_PROVIDER_LIST,
    dataField: 'providerList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.providers, AnalyticsProvider),
    usePagination: false,
  }),

  /* Load analytics profile list */

  ...requestLoopHandlersForGet({
    action: LOAD_ANALYTICS_PROFILE_LIST,
    dataField: 'profileList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.profiles, AnalyticsProfile),
    usePagination: false,
  }),

  /* Load analytics profile detail */

  ...requestLoopHandlersForGet({
    action: LOAD_ANALYTICS_PROFILE,
    dataField: 'profile',
    getDataFromPayload: payload => AnalyticsProfile(payload.profile),
  }),

  /* Create analytics profile */

  ...requestLoopHandlersForUpdate({
    action: CREATE_ANALYTICS_PROFILE,
    stateField: 'createProfileState',
  }),

  /* Update analytics profile */

  ...requestLoopHandlersForUpdate({
    action: UPDATE_ANALYTICS_PROFILE,
    stateField: 'updateProfileState',
    onSuccess: (record, payload, initialPayload) => record.setIn(
      ['profile', 'data'],
      record.getIn(['profile', 'data']).merge(initialPayload.data)
    ),
  }),

  /* Delete analytics profile */

  ...requestLoopHandlersForUpdate({
    action: DELETE_ANALYTICS_PROFILE,
    stateField: 'deleteProfileState',
    onSuccess: (record, payload, { name }) => {
      const profileList = record.getIn(['profileList', 'data'])
      if (profileList) {
        record.setIn(['profileList', 'data'], profileList.filter(profile => profile.name !== name))
      }
    },
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('analytics'),

}, initialState)
