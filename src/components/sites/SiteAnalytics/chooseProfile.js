import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import gaImage from 'assets/images/analytics/google_analytics-horizontal.svg'


export default function ChooseProfile(props) {
  const { server } = props

  return <>
    <Row className="pt-2">
      <Col style={{ maxWidth: '50rem' }}>
        <h2 className="h5 mb-5">
          <img src={gaImage} height="" width="230" alt="Google Analytics" />
        </h2>
        <p className="mb-5">
          Fast sends data to Google Analytics from the actual activity on your site, no Javascript tag required.
          Fast sends actual transfer data so you get the most accurate reporting from your site.
        </p>
      </Col>
    </Row>
    <Button
      color="primary"
      className="mr-2 mb-3 text-f-md"
      tag={Link}
      to="/analytics/create"
    >
      <FontAwesomeIcon icon={faPlus} className="mr-2" />
      Create New Profile
    </Button>
    <Button
      color="primary"
      outline
      className="align-top text-f-md"
      tag={Link}
      to={`/analytics/choose-profile/site/${server}`}
    >
      Choose Existing Profile&hellip;
    </Button>
  </>
}

ChooseProfile.propTypes = {
  server: PropTypes.string.isRequired,
}
