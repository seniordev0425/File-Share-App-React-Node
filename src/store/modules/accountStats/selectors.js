export const selectAccountStats = state => state.getIn(['accountStats', 'accountStats'])

export const selectRecentAccountStats = state => state.getIn(['accountStats', 'recentAccountStats'])
