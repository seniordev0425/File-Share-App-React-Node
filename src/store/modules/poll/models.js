import { Record, Map } from 'immutable'

import { DetailData } from 'store/common/models'


export const PollResult = Record({
  activity: Map(),
}, 'PollResult')

export const State = Record({
  pollResult: DetailData({
    data: PollResult(),
  }),
}, 'PollState')

export const blacklistedFields = []
