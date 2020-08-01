const namespace = 'fastio/storage'

export const AUTOUPDATE_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
}

export const LOAD_STORAGE_LIST = `${namespace}/load_storage_list`
export const LOAD_MY_STORAGE_LIST = `${namespace}/load_my_storage_list`
export const LOAD_STORAGE_DETAIL = `${namespace}/load_storage_detail`
export const LOAD_STORAGE_DETAIL_TO_MAP = `${namespace}/load_storage_detail_to_map`
export const PROCESS_OAUTH_CODE = `${namespace}/process_oauth_code`
export const LOAD_OAUTH_LINK = `${namespace}/load_oauth_link`
export const UNLINK_STORAGE = `${namespace}/unlink_storage`
