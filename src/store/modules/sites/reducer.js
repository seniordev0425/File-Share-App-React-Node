import { List } from 'immutable'
import { handleActions } from 'redux-actions'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_SITE_LIST,
  LOAD_SITE_DETAIL,
  LOAD_SITE_PREVIEW,
  CREATE_SITE,
  UPDATE_SITE_DETAIL,
  DELETE_SITE_DETAIL,
} from './constants'
import { Site, SitePreview, State } from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadSiteList,
  success: loadSiteListSuccess,
  fail: loadSiteListFail,
  reset: loadSiteListReset,
} = defineLoopActions(
  LOAD_SITE_LIST,
  {
    failureMessage: 'Failed to load site list.'
  }
)

export const {
  start: loadSiteDetail,
  success: loadSiteDetailSuccess,
  fail: loadSiteDetailFail,
} = defineLoopActions(
  LOAD_SITE_DETAIL,
  {
    failureMessage: 'Failed to load site details.'
  }
)

export const {
  start: loadSitePreview,
  success: loadSitePreviewSuccess,
  fail: loadSitePreviewFail,
} = defineLoopActions(
  LOAD_SITE_PREVIEW,
  {
    failureMessage: 'Failed to load site preview information.'
  }
)

export const {
  start: createSite,
  success: createSiteSuccess,
  fail: createSiteFail,
  reset: createSiteResetState,
} = defineLoopActions(
  CREATE_SITE,
  {
    failureMessage: 'Failed to create a new site.',
    successMessage: 'A site was successfully created.'
  }
)

export const {
  start: updateSiteDetail,
  success: updateSiteDetailSuccess,
  fail: updateSiteDetailFail,
  reset: updateSiteDetailReset,
} = defineLoopActions(
  UPDATE_SITE_DETAIL,
  {
    failureMessage: 'Failed to update the site.',
    successMessage: 'A site was successfully updated.'
  }
)

export const {
  start: deleteSiteDetail,
  success: deleteSiteDetailSuccess,
  fail: deleteSiteDetailFail,
  reset: deleteSiteDetailReset,
} = defineLoopActions(
  DELETE_SITE_DETAIL,
  {
    failureMessage: 'Failed to delete a site permanently.',
    successMessage: 'A site was permanently deleted.'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load site list */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_LIST,
    dataField: 'siteList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.servers, Site),
    usePagination: false,
  }),

  /* Load site detail */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_DETAIL,
    dataField: 'siteDetail',
    getDataFromPayload: payload => Site(payload.server),
  }),

  /* Load site preview */

  ...requestLoopHandlersForGet({
    action: LOAD_SITE_PREVIEW,
    dataField: payload => ['sitePreviewMap', payload.server],
    getDataFromPayload: payload => SitePreview(payload),
  }),

  /* Create site */

  ...requestLoopHandlersForUpdate({
    action: CREATE_SITE,
    stateField: 'createSiteState',
  }),

  /* Update site detail */

  ...requestLoopHandlersForUpdate({
    action: UPDATE_SITE_DETAIL,
    stateField: 'updateSiteDetailState',
    onSuccess: (record, payload, initialPayload) => {
      if (record.siteDetail.data && record.siteDetail.data.server === initialPayload.server) {
        record.setIn(
          ['siteDetail', 'data'],
          record.getIn(['siteDetail', 'data']).merge(initialPayload.data)
        )
      }

      const index = record.siteList.data.findIndex(site => (
        site.server === initialPayload.server
      ))
      if (index > -1) {
        record.setIn(
          ['siteList', 'data', index],
          record.getIn(['siteList', 'data', index]).merge(initialPayload.data)
        )
      }
    }
  }),

  /* Delete site detail */

  ...requestLoopHandlersForUpdate({
    action: DELETE_SITE_DETAIL,
    stateField: 'deleteSiteDetailState',
    onSuccess: (record, payload, { server }) => {
      const siteList = record.getIn(['siteList', 'data'])
      if (siteList) {
        record.setIn(['siteList', 'data'], siteList.filter(site => site.server !== server))
      }
    },
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('sites'),

}, initialState)
