import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter, Redirect } from 'react-router-dom'

import { reportError } from 'utils/analytics'
import { selectReportingError } from 'store/modules/log'
import ErrorPage from 'components/common/GlobalErrorBoundary/page'


export function ErrorReportPage(props) {
  const { history, error } = props

  const handleGoBack = () => history.goBack()

  const handleSubmit = () => {
    reportError(error)

    history.push('/report-error/done')
  }

  if (!error) {
    return <Redirect to="/" />
  }

  return <ErrorPage
    error={error}
    onCancel={handleGoBack}
    onSubmit={handleSubmit}
  />
}

ErrorReportPage.propTypes = {
  history: PropTypes.object.isRequired,
  error: PropTypes.object,
}

const selector = createStructuredSelector({
  error: selectReportingError,
})

export default compose(
  withRouter,
  connect(selector),
)(ErrorReportPage)
