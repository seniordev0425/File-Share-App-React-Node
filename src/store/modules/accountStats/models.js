import { Record, List } from 'immutable'

import { DetailData } from 'store/common/models'


export const AccountStatsRecord = Record({
  transfers: 0,
  bytes: 0,
  start: '',
  end: '',
}, 'AccountStatsRecord')

export const AccountStats = Record({
  server: '',
  results: 0,
  interval: 0,
  transfers: List(),
}, 'AccountStats')

export const State = Record({
  accountStats: DetailData(),
  recentAccountStats: DetailData(),
}, 'AccountStatsState')

export const blacklistedFields = []
