import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import gaImage from 'assets/images/analytics/google_analytics-horizontal.svg'


function AnalyticsProfile(props) {
  const { profile, server } = props

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

    <Row className="mb-3">
      <Col xs="12">
        <div className="d-flex flex-wrap align-items-center py-2 px-3 rounded-lg Profile bg-f-gray15">
          <div className="my-2 mr-4 rounded bg-white Profile-preview"></div>
          <div className="my-2 mr-auto">
            <h3 className="h6 mb-2 text-break">Tom’s Analytics</h3>
            <div className="Site-details" style={{ fontSize: 0 }}>
              <span className="mr-3 pr-3 border-right border-f-gray11 text-f-sm">Google Analytics</span>
              <span className="mr-4 text-nowrap text-f-sm">Tracking ID # {profile.token}</span>
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap ml-sm-auto" ml-0="">
            <div className="rounded-circle d-flex mr-4 my-2 bg-white Profile-owner">
              <span className="m-auto">TL</span>
            </div>
            <div className="w-100 d-sm-none d-block"></div>
            <Button
              color="primary"
              outline
              className="my-2 mr-2 text-f-md"
              tag={Link}
              to={`/analytics/${profile.name}`}
            >
              View Profile Details
            </Button>
            <Button
              color="primary"
              className="my-2 mr-3 text-f-md"
              tag={Link}
              to={`/analytics/choose-profile/site/${server}`}
            >
              Switch Profile
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  </>
}

AnalyticsProfile.propTypes = {
  profile: ImmutablePropTypes.record.isRequired,
  server: PropTypes.string.isRequired,
}

export default AnalyticsProfile
