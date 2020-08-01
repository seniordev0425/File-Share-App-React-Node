import createSagaMiddleware from 'redux-saga'
import { Map } from 'immutable'
import { combineReducers } from 'redux-immutable'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import localForage from 'localforage'
import { connectRouter, routerMiddleware } from 'connected-react-router/immutable'
import { all } from 'redux-saga/effects'
import { reducer as modalReducer } from 'redux-modal'

import { PERSIST_STORAGE_KEY_PREFIX } from 'constants/common'
import authMiddleware from 'store/middlewares/auth'
import notificationMiddleware from 'store/middlewares/notification'
import logMiddleware from 'store/middlewares/log'

import {
  immutableTransform,
  requestStateTransform,
  fieldFilterTransform,
  blacklistedModules,
 } from 'store/persist'

/* Import reducers and sagas */
import {
  LOGOUT, reducer as authReducer, saga as authSaga,
} from './modules/auth'
import {
  reducer as systemReducer, saga as systemSaga,
} from './modules/system'
import {
  reducer as twofactorReducer, saga as twofactorSaga,
} from './modules/twofactor'
import {
  reducer as storageReducer, saga as storageSaga,
} from './modules/storage'
import {
  reducer as analyticsReducer, saga as analyticsSaga,
} from './modules/analytics'
import {
  reducer as cdnReducer, saga as cdnSaga,
} from './modules/cdn'
import {
  reducer as siteContentReducer, saga as siteContentSaga,
} from './modules/siteContent'
import {
  reducer as siteStatsReducer, saga as siteStatsSaga,
} from './modules/siteStats'
import {
  reducer as sitesReducer, saga as sitesSaga,
} from './modules/sites'
import {
  reducer as userReducer, saga as userSaga,
} from './modules/user'
import {
  reducer as billingReducer, saga as billingSaga,
} from './modules/billing'
import {
  reducer as accountStatsReducer, saga as accountStatsSaga,
} from './modules/accountStats'
import {
  reducer as persistReducer, setRehydratedFlag,
} from './modules/persist'
import {
  reducer as pollReducer, saga as pollSaga,
} from './modules/poll'
import {
  reducer as notificationsReducer, saga as notificationsSaga,
} from './modules/notifications'
import {
  reducer as domainsReducer, saga as domainsSaga,
} from './modules/domains'
import {
  reducer as logReducer, saga as logSaga,
} from './modules/log'
import {
  reducer as eventsReducer, saga as eventsSaga,
} from './modules/events'
import {
  reducer as siteUpdatesReducer, saga as siteUpdatesSaga,
} from './modules/siteUpdates'


// Create browser history
export const history = createBrowserHistory()

// Middlewares
const sagaMiddleware = createSagaMiddleware()
const middlewares = [
  routerMiddleware(history),
  sagaMiddleware,
  authMiddleware,
  notificationMiddleware,
  logMiddleware,
]
const enhancers = [
  applyMiddleware(...middlewares),
  autoRehydrate(),
]

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  (
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
  compose
/* eslint-enable */

// Create store

const appReducer = combineReducers({
  router: connectRouter(history),
  modal: modalReducer,
  analytics: analyticsReducer,
  auth: authReducer,
  cdn: cdnReducer,
  siteContent: siteContentReducer,
  siteStats: siteStatsReducer,
  sites: sitesReducer,
  storage: storageReducer,
  system: systemReducer,
  twofactor: twofactorReducer,
  user: userReducer,
  billing: billingReducer,
  accountStats: accountStatsReducer,
  persist: persistReducer,
  poll: pollReducer,
  notifications: notificationsReducer,
  domains: domainsReducer,
  log: logReducer,
  events: eventsReducer,
  siteUpdates: siteUpdatesReducer,
})

// Reset store when logging out
const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = Map({
      router: state.get('router'),
      persist: state.get('persist'),
    })
  }
  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  Map(),
  composeEnhancers(...enhancers)
)

const persistConfig = {
  keyPrefix: PERSIST_STORAGE_KEY_PREFIX,
  storage: localForage,
  blacklist: blacklistedModules,
  transforms: [
    fieldFilterTransform,
    immutableTransform,
    requestStateTransform,
  ],
}

export const persistor = persistStore(store, persistConfig, () => {
  store.dispatch(setRehydratedFlag())
})

// Run saga middleware
sagaMiddleware.run(function* rootSaga() {
  yield all([
    analyticsSaga(),
    authSaga(),
    cdnSaga(),
    siteContentSaga(),
    siteStatsSaga(),
    sitesSaga(),
    storageSaga(),
    systemSaga(),
    twofactorSaga(),
    userSaga(),
    billingSaga(),
    accountStatsSaga(),
    pollSaga(),
    notificationsSaga(),
    domainsSaga(),
    logSaga(),
    eventsSaga(),
    siteUpdatesSaga(),
  ])
})

export default store
