import { Record, Map } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData, ListData } from 'store/common/models'


export const OAuthLink = Record({
  provider: '',
  redirect_url: '',
  return_url: '',
}, 'OAuthLink')

export const Storage = Record({
  id: '',
  name: '',
  display: '',
  enabled: true,
  protected: false,
  url: '',
}, 'Storage')

export const StorageDetail = Record({
  id: 0,
  name: '',
  display: '',
  provider_id: '',
  email: '',
  authenticated: true,
  expired: false,
  enabled: true,
  protected: false,
  autoupdate: '',
  origin_url: '',
  error: null,
  updated: '',
}, 'StorageDetail')

export const OAuthResult = Record({
  provider: '',
  email: '',
  password: null,
}, 'OAuthResult')

export const State = Record({
  storageList: ListData(),
  myStorageList: ListData(),
  storageDetail: DetailData(),
  storageDetailMap: Map(),
  oauthLink: DetailData(),
  oauthResult: DetailData(),
  unlinkStorageState: REQUEST_STATUS.INITIAL,
}, 'StorageState')

export const blacklistedFields = [
  'storageDetailMap',
  'oauthLink',
  'oauthResult',
  'unlinkStorageState',
]
