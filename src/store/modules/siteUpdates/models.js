import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'


export const ChangeStatus = Record({
  name: '',
  domain: '',
  server: '',
  waited: 0,
  remaining: 0,
  extensions: 0,
  changes: [],
  complete: false,
  stale: false,
  started: '',
  last: '',
  updated: '',
}, 'ChangeStatus')

export const PrecacheJob = Record({
  key: '',
  session: '',
  name: '',
  domain: '',
  server: '',
  status: 'running',
  path: '',
  path_curr: null,
  depth: '',
  data: true,
  flush: true,
  event: true,
  folders: 0,
  files: 0,
  bytes: 0,
  stale: false,
  started: '',
  updated: '',
  ended: ''
}, 'PrecacheJob')

export const PrecacheStatus = Record({
  key: '',
  name: '',
  domain: '',
  server: '',
  status: 'running',
  stale: false,
  jobs: 0,
  queued: 0,
  folders: 0,
  files: 0,
  bytes: 0,
  current: PrecacheJob(),
  started: '',
  ended: ''
}, 'PrecacheStatus')

export const State = Record({
  changeStatusList: ListData(),
  precacheStatusList: ListData(),
  flushCacheRequestState: REQUEST_STATUS.INITIAL,
  precacheRequestState: REQUEST_STATUS.INITIAL,
  runStaleChangesState: REQUEST_STATUS.INITIAL,
}, 'SiteUpdatesState')

export const blacklistedFields = [
  'flushCacheRequestState',
  'precacheRequestState',
  'runStaleChangesState',
]
