export const selectStorageList = state => state.getIn(['storage', 'storageList'])

export const selectMyStorageList = state => state.getIn(['storage', 'myStorageList'])

export const selectStorageDetail = state => state.getIn(['storage', 'storageDetail'])

export const selectStorageDetailMap = state => state.getIn(['storage', 'storageDetailMap'])

export const selectOAuthLink = state => state.getIn(['storage', 'oauthLink'])

export const selectOAuthResult = state => state.getIn(['storage', 'oauthResult'])

export const selectUnlinkStorageState = state => state.getIn(['storage', 'unlinkStorageState'])
