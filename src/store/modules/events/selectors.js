export const selectEventList = state => state.getIn(['events', 'eventList'])

export const selectNotificationList = state => state.getIn(['events', 'notificationList'])

export const selectSiteEventList = state => state.getIn(['events', 'siteEventList'])

export const selectAcknowledgeEventState = state => state.getIn(['events', 'acknowledgeEventState'])
