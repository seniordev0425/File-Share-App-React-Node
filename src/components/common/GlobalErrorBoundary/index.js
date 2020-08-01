import React, { Component } from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { reportError } from 'utils/analytics'
import ErrorPage from './page'


export class GlobalErrorBoundary extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    error: null,
  }

  handleGoBack = () => {
    const { history } = this.props

    this.setState({
      error: null,
    })
    history.push('/')
  }

  handleSubmit = () => {
    reportError(this.state.error)

    this.setState({
      error: null,
    })
    this.props.history.push('/report-error/done')
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    }
  }

  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    const { children } = this.props
    const { error } = this.state

    return error ?
      <ErrorPage
        error={error}
        onCancel={this.handleGoBack}
        onSubmit={this.handleSubmit}
      /> :
      children
  }
}

export default compose(
  withRouter,
)(GlobalErrorBoundary)
