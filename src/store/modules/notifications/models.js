import { Record, List } from 'immutable'
import moment from 'moment'


export const Notification = Record({
  id: '',
  type: '',
  message: '',
  createdAt: moment(),
  error: null,
})

export const State = Record({
  notificationList: List(),
})
