import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  requestLoopHandlersForGet,
  convertToListRecord,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_PATH_DETAILS,
  LOAD_ROOT_DETAILS,
  LOAD_FOLDER_CONTENT,
} from './constants'
import {
  FileOrFolder, PathDetails, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadPathDetails,
  success: loadPathDetailsSuccess,
  fail: loadPathDetailsFail,
} = defineLoopActions(
  LOAD_PATH_DETAILS,
  {
    failureMessage: 'Failed to load path details.'
  }
)

export const {
  start: loadRootDetails,
  success: loadRootDetailsSuccess,
  fail: loadRootDetailsFail,
  reset: loadRootDetailsReset,
} = defineLoopActions(
  LOAD_ROOT_DETAILS,
  {
    failureMessage: 'Failed to load root details.'
  }
)

export const {
  start: loadFolderContent,
  success: loadFolderContentSuccess,
  fail: loadFolderContentFail,
  reset: resetFolderContent,
} = defineLoopActions(
  LOAD_FOLDER_CONTENT,
  {
    failureMessage: 'Failed to load folder content.'
  }
)

/* Reducer */

export const reducer = handleActions({

  /* Load path details */

  ...requestLoopHandlersForGet({
    action: LOAD_PATH_DETAILS,
    dataField: 'pathDetails',
    preservePreviousState: true,
    getDataFromPayload: payload => PathDetails({
      ...payload,
      details: FileOrFolder(payload.details)
    }),
  }),

  /* Load root details */

  ...requestLoopHandlersForGet({
    action: LOAD_ROOT_DETAILS,
    dataField: 'rootDetails',
    preservePreviousState: true,
    getDataFromPayload: payload => PathDetails({
      ...payload,
      details: FileOrFolder(payload.details)
    }),
  }),

  /* Load folder content */

  ...requestLoopHandlersForGet({
    action: LOAD_FOLDER_CONTENT,
    dataField: 'content',
    initialValue: List(),
    preservePreviousState: true,
    usePagination: false,
    getDataFromPayload: payload => convertToListRecord(payload.list.sort((record1, record2) => {
      if (record1.type === 'folder' && record2.type === 'file') {
        return -1
      } else if (record1.type === 'file' && record2.type === 'folder') {
        return 1
      }
      return 0
    }), FileOrFolder),
    onInitial: (record, payload) => {
      record.set('currentPath', payload.path)
    },
    onSuccess: (record, payload) => {
      record.set('currentPath', payload.path)
    },
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('siteContent'),

}, initialState)
