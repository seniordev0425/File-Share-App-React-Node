import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Button, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { isPending, hasSucceeded } from 'utils/state'
import {
  selectCreateProfileState,
  createAnalyticsProfile,
} from 'store/modules/analytics'
import AnalyticsProfileCreateForm from '../AnalyticsProfileCreateForm'


export function AnalyticsProfileCreate(props) {
  const {
    createProfileState, createAnalyticsProfile,
  } = props

  const handleSubmitForm = data => {
    createAnalyticsProfile({
      data: {
        ...data,
        provider: 'googleanalytics',
      },
    })
  }

  return <>
    <Button
      outline
      color="primary"
      className="border-0 mt-3 ml-3 BackButton text-f-md"
      tag={Link}
      to="/account/analytics"
    >
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Analytics
    </Button>

    <section className="p-5">
      <AnalyticsProfileCreateForm
        submitting={isPending(createProfileState)}
        submitted={hasSucceeded(createProfileState)}
        onSubmit={handleSubmitForm}
        renderConfirmationPage={() => <Row>
          <Col className="d-flex flex-column text-center mx-auto" style={{ maxWidth: '35rem' }}>
            <h1 className="h4 mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-f-color2 mr-2" />
              Successfully created Tom's Analytics
            </h1>
            <p className="mb-5">
              The Google Analytics profile “Tom’s Analytics” was successfully created and applied to Tom’s Website.
              You can modify this profile on the <Link to="/account/analytics">profile settings page</Link>.
            </p>
            <Button
              color="primary"
              className="ml-auto"
              tag={Link}
              to="/account/analytics"
            >
              Done
            </Button>
          </Col>
        </Row>}
      />
    </section>
  </>
}

AnalyticsProfileCreate.propTypes = {
  createProfileState: PropTypes.string.isRequired,
  createAnalyticsProfile: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  createProfileState: selectCreateProfileState,
})

const actions = {
  createAnalyticsProfile,
}

export default compose(
  connect(selector, actions),
)(AnalyticsProfileCreate)
