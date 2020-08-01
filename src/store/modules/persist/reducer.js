import { createAction, handleActions } from 'redux-actions'
import { EXPIRE_PERSISTED_DATA } from 'store/persist'
import {
  SET_REHYDRATED_FLAG,
} from './constants'
import { State } from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const setRehydratedFlag = createAction(SET_REHYDRATED_FLAG)
export const expirePersistedData = createAction(EXPIRE_PERSISTED_DATA)

/* Reducer */

export const reducer = handleActions({

  /* Set rehydrated flag */

  [SET_REHYDRATED_FLAG]: state => state.set('rehydrated', true),

}, initialState)
