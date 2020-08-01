export const PERSIST_STORAGE_KEY_PREFIX = 'fastio'
/*
 * Avoid importing these status constants directly for checking state.
 * Instead use state helpers defined in utils/state.js
 */
export const REQUEST_STATUS = {
  INITIAL: 'request_initial',
  PENDING: 'request_pending',
  SUCCESS: 'request_success',
  FAIL: 'request_fail',
}

export const EXPIRATION_STATUS = {
  NOT_EXPIRED: 'expiration_not_expired',
  EXPIRED: 'expiration_expired',
  REFRESHING: 'expiration_refreshing',
}

export const DEFAULT_PAGE_SIZE = 10

export const CURRENCY_MAP = {
  usd: '$'
}

export const STORAGE_NAME_MAP = {
  googledrive: 'Google Drive',
  dropbox: 'Dropbox',
  box: 'Box',
  mediafire: 'Mediafire',
  onedrive: 'Onedrive'
}

export const NOTIFICATION_DISPLAY_TIME = 10000   // in ms

export const NEW_SITE_CDN = 'auto'

export const FILTER_MODE_MAP = {
  EVERYTHING: 0,
  INCLUDE_REGEX: 1,
  NOTHING: 2,
}

export const FILTER_MODE_OPTIONS = [
  { value: FILTER_MODE_MAP.EVERYTHING, label: 'Disabled' },
  { value: FILTER_MODE_MAP.INCLUDE_REGEX, label: 'Include' },
  { value: FILTER_MODE_MAP.NOTHING, label: 'Exclude' },
]

export const DEFAULT_EXCLUDE_FILTER_REGEX =
  '/(\\/\\.|\\/\\~|.*(\\n|\\r).*)|(\\/desktop\\.ini$|\\/thumbs\\.db|icon\\r)/'

export const JOB_STATES = {
  syncing: 'syncing',
  pushing: 'pushing',
  complete: 'complete',
  warning: 'warning',
  stale: 'stale',
}

export const STOPPED_JOB_STATES = ['warning', 'stale']

export const BACK_END_LANGUAGE_EXTENSIONS = [
  'php', 'py', 'rb', 'java', 'go', 'aspx', 'pl', 'scala', 'sc',
  'ex', 'exs', 'cs', 'sh', 'erl', 'hrl', 'beam', 'ez', 'd',
]

export const POLL_THROTTLE_SMALL = 700
export const POLL_THROTTLE_BIG = 5000

export const VERSION_CHECK_POLL_INTERVAL = 10 * 60    // In seconds
