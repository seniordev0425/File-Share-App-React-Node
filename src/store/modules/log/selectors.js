export const selectLogList = state => state.getIn(['log', 'logList'])

export const selectReportingError = state => state.getIn(['log', 'reportingError'])
