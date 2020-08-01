export const selectChangeStatusList = state => state.getIn(['siteUpdates', 'changeStatusList'])

export const selectPrecacheStatusList = state => state.getIn(['siteUpdates', 'precacheStatusList'])

export const selectFlushCacheRequestState = state => state.getIn(['siteUpdates', 'flushCacheRequestState'])

export const selectPrecacheRequestState = state => state.getIn(['siteUpdates', 'precacheRequestState'])

export const selectRunStaleChangesState = state => state.getIn(['siteUpdates', 'runStaleChangesState'])
