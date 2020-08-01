import { isExpiredButRefreshing } from 'utils/state'


export const selectRehydrated = state => state.getIn(['persist', 'rehydrated'])

export const selectIsRefreshing = state => {
  let refreshing = false

  state.toSeq().forEach(module => {
    module.toSeq && module.toSeq().forEach(field => {
      if (field && isExpiredButRefreshing(field.expirationStatus)) {
        refreshing = true
        return false
      }
      return true
    })
    return !refreshing
  })

  return refreshing
}

export const selectIsRefreshingVisibly = state => {
  /*
   * This selector is for showing data refresh spinner on user avatar at top right
   * This spinner show not show up for sync/push changes
   */
  let refreshing = false

  state.toSeq().forEach((module, moduleName) => {
    if (moduleName !== 'siteUpdates') {
      module.toSeq && module.toSeq().forEach(field => {
        if (field && isExpiredButRefreshing(field.expirationStatus)) {
          refreshing = true
          return false
        }
        return true
      })
    }
    return !refreshing
  })

  return refreshing
}
