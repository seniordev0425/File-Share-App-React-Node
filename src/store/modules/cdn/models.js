import { Record } from 'immutable'

import { ListData } from 'store/common/models'


export const CDN = Record({
  id: 0,
  name: '',
  display: '',
  pricing: 0,
  enabled: true,
}, 'CDN')

export const State = Record({
  cdnList: ListData(),
}, 'CdnState')

export const blacklistedFields = []
