import { Record } from 'immutable'

import { ListData } from 'store/common/models'


export const Domain = Record({
  id: '',
  name: '',
}, 'Domain')

export const State = Record({
  domainList: ListData(),
})

export const blacklistedFields = []
