import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'


export const Event = Record({
  eid: '',
  server: null,
  category: '',
  code: 0,
  subject: '',
  desc: '',
  created: '',
  alarm: false,
  acknowledged: null,
  resolved: null,
}, 'Event')

export const State = Record({
  eventList: ListData(),
  notificationList: ListData(),
  siteEventList: ListData(),
  acknowledgeEventState: REQUEST_STATUS.INITIAL,
})

export const blacklistedFields = [
  'notificationList',
  'acknowledgeEventState',
]
