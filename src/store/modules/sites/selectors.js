export const selectSiteList = state => state.getIn(['sites', 'siteList'])

export const selectSiteDetail = state => state.getIn(['sites', 'siteDetail'])

export const selectSitePreviewMap = state => state.getIn(['sites', 'sitePreviewMap'])

export const selectCreateSiteState = state => state.getIn(['sites', 'createSiteState'])

export const selectUpdateSiteDetailState = state => state.getIn(['sites', 'updateSiteDetailState'])

export const selectDeleteSiteDetailState = state => state.getIn(['sites', 'deleteSiteDetailState'])
