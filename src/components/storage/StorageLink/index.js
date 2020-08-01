import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import { Container, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import 'url-search-params-polyfill'

import { hasSucceeded, hasFailed } from 'utils/state'
import { selectIsAuthenticated } from 'store/modules/auth'
import {
  selectOAuthResult,
  processOAuthCode,
  processOAuthCodeReset,
  loadMyStorageListReset,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'


export function StorageLink(props) {
  const {
    history, match, location, isAuthenticated,
    processOAuthCodeReset, oauthResult, processOAuthCode,
    loadMyStorageListReset,
  } = props
  const storage = match.params.storage
  const params = new URLSearchParams(location.search)
  const code = params.get('code')
  const state = params.get('state')
  const oauthParamsReady = code && state
  // const routeToGoback = isAuthenticated ? '/account/storage' : '/signup'

  useEffect(() => {
    processOAuthCodeReset()

    processOAuthCode({
      storage,
      data: {
        state,
        code,
      }
    })
  }, [])

  useEffect(() => {
    if (hasSucceeded(oauthResult.state)) {
      loadMyStorageListReset()
      const nextRoute = isAuthenticated ?
        '/account/storage' :
        (oauthResult.data.password ? '/signup/setpassword' : '/login/welcome-back')
      history.push(nextRoute)
    }
  }, [oauthResult])

  return <Container>
    <div className="my-5 mx-auto text-f-sm text-center" style={{ maxWidth: '40rem' }}>
      {
        oauthParamsReady && !hasFailed(oauthResult.state) && <Spinner />
      }

      {
        (
          !oauthParamsReady ||
          (oauthParamsReady && hasFailed(oauthResult.state))
        ) && <section className="mx-auto" style={{ maxWidth: '35rem' }}>
          <div className="py-5 px-md-5 px-4 text-center DetailBlock">
            <h1 className="h5 mb-4 font-weight-bold">Unable to complete signup</h1>
            <p className="text-f-md text-f-gray3">
              Unfortunately we were unable to process your signup request.
              This may be due to an account suspension or we may have detected suspicious use of your account.
            </p>
            <p className="mb-5 text-f-md text-f-gray3">
              We apologize for the inconvenience.
              If you believe you have reached this page in error please contact our customer support.
            </p>
            <Button color="success" size="lg" className="w-100 py-3 text-f-md">Contact Support</Button>
          </div>
        </section>
      }
    </div>
  </Container>
}

StorageLink.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  oauthResult: ImmutablePropTypes.record.isRequired,
  processOAuthCode: PropTypes.func.isRequired,
  processOAuthCodeReset: PropTypes.func.isRequired,
  loadMyStorageListReset: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
  oauthResult: selectOAuthResult,
})

const actions = {
  processOAuthCode,
  processOAuthCodeReset,
  loadMyStorageListReset,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(StorageLink)
