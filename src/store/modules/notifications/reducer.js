import { createAction, handleActions } from 'redux-actions'

import { PUSH, POP } from './constants'
import { Notification, State } from './models'
import moment from 'moment'


/* Initial state */

const initialState = new State()

/* Action creators */

export const push = createAction(PUSH)
export const pop = createAction(POP)

/* Reducer */

export const reducer = handleActions({

  /* Push notification */

  [PUSH]: (state, { payload }) => state.withMutations(record => {
    record.set('notificationList', record.get('notificationList').push(Notification({
      ...payload,
      id: `${Math.floor(Math.random() * 999999 + 100000)}_${Math.floor(new Date().getTime() / 1000)}`,
      createdAt: moment()
    })))
  }),

  /* Pop notification */

  [POP]: (state, { payload }) => state.withMutations(record => {
    const id = payload
    if (id) {
      record.set('notificationList', record.get('notificationList').filterNot(notification => notification.id === id))
    } else {
      record.set('notificationList', record.get('notificationList').pop())
    }
  }),

}, initialState)
