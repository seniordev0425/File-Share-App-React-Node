import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Row, Col, Button } from 'reactstrap'
import 'url-search-params-polyfill'

import { STORAGE_NAME_MAP } from 'constants/common'
import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectOAuthLink,
  loadOAuthLink,
} from 'store/modules/storage'


export function StorageContinue(props) {
  const { match, oauthLink, loadOAuthLink } = props
  const storage = match.params.storage
  const storageName = STORAGE_NAME_MAP[storage] || 'Cloud Storage'
  const queryParams = new URLSearchParams(window.location.search)
  const isRelinking = queryParams.get('relink') === 'true'

  const handleContinue = () => {
    if (hasSucceeded(oauthLink.state)) {
      window.location.assign(oauthLink.data.redirect_url)
    }
  }

  useDataLoadEffect(
    oauthLink,
    loadOAuthLink,
    () => ({
      storage,
    }),
    needsLoading => needsLoading || oauthLink.data.provider !== storage,
  )

  return <section className="mx-auto" style={{ maxWidth: '48rem' }}>
    <div className="py-5 px-md-5 p-4 text-center DetailBlock text-f-gray3">
      <h1 className="h5 mb-4 font-weight-bold">
        {
          isRelinking ?
          `Now we’ll pair ${storageName} with Fast` :
          `Great, now we’ll pair ${storageName} with Fast`
        }
      </h1>
      <p className="mb-4 mx-md-5 mx-0 text-f-md">
        Click Continue below to connect your {storageName}, we’ll create a folder in your {storageName} called “Fast.io” where we’ll keep your sites.
      </p>
      <Row noGutters className="align-items-md-start align-items-center justify-content-center flex-md-row flex-column mx-md-5 mx-0 mb-5">
        <Col className="py-md-0 py-3" style={{ maxWidth: '15rem' }}>
          <h2
            className="
              d-flex
              align-items-center
              justify-content-center
              rounded-circle
              p-2
              mx-auto mb-3
              text-white
              text-f-md
              bg-f-gray10"
            style={{ width: '2rem', height: '2rem' }}>1
          </h2>
          <div className={`mb-2 rounded-lg border border-f-gray11 SignUp-fast-${storage}`} style={{ height: 160 }}></div>
          <span className="text-f-sm">First, authorize Fast.io on {storageName}.</span>
        </Col>
        <Col xs="2" className="d-md-flex d-none align-self-stretch align-items-center justify-content-center pt-3">
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
          <i className="rounded-circle bg-f-gray8" style={{ padding: 1, margin: 1 }}></i>
        </Col>
        <Col className="py-md-0 py-3" style={{ maxWidth: '15rem' }}>
          <h2
            className="
              d-flex
              align-items-center
              justify-content-center
              rounded-circle
              p-2
              mx-auto mb-3
              text-white
              text-f-md
              bg-f-gray10"
            style={{ width: '2rem', height: '2rem' }}>2
          </h2>
          <div className={`mb-2 rounded-lg border border-f-gray11 SignUp-fast-${storage}-folder`} style={{ height: 160 }}></div>
          <span className="text-f-sm">Then, we'll add a "Fast.io" folder.</span>
        </Col>
      </Row>
      <Button
        color="success"
        className="px-sm-5 px-3 py-3 text-f-md"
        onClick={handleContinue}
        disabled={!hasSucceeded(oauthLink.state)}
      >
        Ready? Connect {storageName} Now
      </Button>
    </div>
  </section>
}

StorageContinue.propTypes = {
  match: PropTypes.object.isRequired,
  oauthLink: ImmutablePropTypes.record.isRequired,
  loadOAuthLink: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  oauthLink: selectOAuthLink,
})

const actions = {
  loadOAuthLink,
}

export default compose(
  connect(selector, actions),
)(StorageContinue)
