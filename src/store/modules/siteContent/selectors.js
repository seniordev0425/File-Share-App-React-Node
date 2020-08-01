export const selectPathDetails = state => state.getIn(['siteContent', 'pathDetails'])

export const selectRootDetails = state => state.getIn(['siteContent', 'rootDetails'])

export const selectCurrentPath = state => state.getIn(['siteContent', 'currentPath'])

export const selectCurrentContent = state => state.getIn(['siteContent', 'content'])
