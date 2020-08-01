export const selectAnalyticsProviderList = state => state.getIn(['analytics', 'providerList'])

export const selectAnalyticsProfileList = state => state.getIn(['analytics', 'profileList'])

export const selectAnalyticsProfile = state => state.getIn(['analytics', 'profile'])

export const selectCreateProfileState = state => state.getIn(['analytics', 'createProfileState'])

export const selectUpdateProfileState = state => state.getIn(['analytics', 'updateProfileState'])

export const selectDeleteProfileState = state => state.getIn(['analytics', 'deleteProfileState'])
