import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData, DetailData } from 'store/common/models'


export const AnalyticsProvider = Record({
  id: '',
  name: '',
  display: '',
  provider_url: '',
  enabled: true
}, 'AnalyticsProvider')

export const AnalyticsProfile = Record({
  name: '',
  provider: '',
  token: '',
  event_name: '',
  referrer: false,
  filter_mode: '',
  filter: null,
  filter_mode_country: 0,
  filter_country: null,
  provider_url: '',
  updated: '',
}, 'AnalyticsProfile')

export const State = Record({
  providerList: ListData(),
  profileList: ListData(),
  profile: DetailData(),
  createProfileState: REQUEST_STATUS.INITIAL,
  updateProfileState: REQUEST_STATUS.INITIAL,
  deleteProfileState: REQUEST_STATUS.INITIAL,
}, 'AnalyticsState')

export const blacklistedFields = [
  'createProfileState',
  'updateProfileState',
  'deleteProfileState',
]
