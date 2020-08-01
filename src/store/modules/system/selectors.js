export const selectSystemStatus = state => state.getIn(['system', 'systemStatusData'])

export const selectCachedVersion = state => state.getIn(['system', 'cachedVersion'])
