import { Map } from 'immutable'

import { EXPIRATION_STATUS } from 'constants/common'
import { EXPIRE_PERSISTED_DATA } from './constants'
import { hasSucceeded } from '../../utils/state'

/*
 * Value of this const follows the format of response data returned from Polling API.
 * In each entry, key is unique identifier and value is the field name of each entry in response data.
 */
export const PollingResultType = {
  analytics: 'analytics',
  apikey: 'apikey',
  billing: 'billing',
  cdns: 'cdns',
  changes: 'changes',
  events: 'events',
  flush: 'flush',
  precache: 'precache',
  servers: 'servers',
  storage: 'storage',
  user: 'user',
  analyticConfig: 'analytic:config',
  cdnConfig: 'cdn:config',
  serverChanges: 'server:changes',
  serverConfig: 'server:config',
  serverContent: 'server:content',
  serverEvent: 'server:event',
  serverFlush: 'server:flush',
  serverPrecache: 'server:precache',
}

/*
 * This map correspondings store modules to each server object name in polling result.
 * Note that `poll` module is not included here because it can't be expired by polling logic itself.
 */
export const activityFieldMap = {
  accountStats: PollingResultType.user,
  analytics: PollingResultType.analytics,
  auth: PollingResultType.user,
  billing: PollingResultType.billing,
  cdn: PollingResultType.cdns,
  siteUpdates: PollingResultType.changes,
  siteContent: [
    PollingResultType.servers,
    PollingResultType.serverContent,
  ],
  siteStats: PollingResultType.servers,
  sites: PollingResultType.servers,
  storage: PollingResultType.storage,
  system: PollingResultType.analytics,
  twofactor: PollingResultType.user,
  user: PollingResultType.user,
  events: PollingResultType.events,
  // Map for specific fields inside modules
  // In each entry, key is moduleName:fieldName and value is extended activity values from the api.
  'analytics:profileList': PollingResultType.analyticConfig,
  'analytics:profile': PollingResultType.analyticConfig,
  'cdn:cdnList': PollingResultType.cdnConfig,
  'siteUpdates:changeStatusList': [
    PollingResultType.serverChanges,
    PollingResultType.serverFlush,
  ],
  'sites:siteList': PollingResultType.serverConfig,
  'sites:siteDetail': PollingResultType.serverConfig,
  'sites:sitePreviewMap': [
    PollingResultType.serverConfig,
    PollingResultType.serverContent,
  ],
  'events:eventList': PollingResultType.serverEvent,
  'events:notificationList': PollingResultType.serverEvent,
  'events:siteEventList': PollingResultType.serverEvent,
  'siteUpdates:precacheStatusList': PollingResultType.serverPrecache,
}

/*
 * Name of modules not to persist into storage
 */
export const blacklistedModules = [
  'router', 'persist', 'notifications', 'log', 'modal',
]

export const moduleMap = {}
Object.keys(activityFieldMap).forEach(moduleName => {
  const activityField = activityFieldMap[moduleName]
  if (activityField.constructor === Array) {
    activityField.forEach(_activityField => {
      if (!moduleMap[_activityField]) {
        moduleMap[_activityField] = []
      }
      moduleMap[_activityField].push(moduleName)
    })
  } else {
    if (!moduleMap[activityField]) {
      moduleMap[activityField] = []
    }
    moduleMap[activityField].push(moduleName)
  }
})

const setFieldToExpired = (record, fieldName) => {
  const field = record.get(fieldName)

  if (field && field.state && hasSucceeded(field.state)) {
    record.setIn([fieldName, 'expirationStatus'], EXPIRATION_STATUS.EXPIRED)
  } else if (Map.isMap(field)) {
    field.map((subfield, subfieldName) => {
      if (subfield.state && hasSucceeded(subfield.state)) {
        record.setIn(
          [fieldName, subfieldName, 'expirationStatus'],
          EXPIRATION_STATUS.EXPIRED
        )
      }
      return undefined
    })
  }
}

export const createPersistenceHandlers = (moduleName) => ({
  [EXPIRE_PERSISTED_DATA]: (state, { payload: expiredObjects }) => {
    let nextState = state

    if (expiredObjects.indexOf(moduleName) >= 0) {
      nextState = nextState.withMutations(record => {
        nextState.toSeq().toMap().map((field, fieldName) => {
          setFieldToExpired(record, fieldName)
          return undefined
        })
      })
    } else {
      expiredObjects.forEach(expiredObject => {
        if (expiredObject.indexOf(moduleName) === -1) {
          return
        }

        const fieldName = expiredObject.split(':')[1]
        nextState = nextState.withMutations(record => setFieldToExpired(record, fieldName))
      })
    }

    return nextState
  },
})
