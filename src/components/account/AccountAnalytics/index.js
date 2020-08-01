import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col, Button,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

import { isLoading, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectAnalyticsProviderList,
  selectAnalyticsProfileList,
  selectDeleteProfileState,
  loadAnalyticsProviderList,
  loadAnalyticsProfileList,
  deleteAnalyticsProfile,
} from 'store/modules/analytics'
import Spinner from 'components/common/Spinner'
import titleImage from 'assets/images/analytics/google_analytics-horizontal.svg'


export function AccountAnalytics(props) {
  const {
    providerList, analyticsProfileList,
    loadAnalyticsProviderList, loadAnalyticsProfileList, /*deleteAnalyticsProfile,*/
  } = props

  // const handleDeleteProfile = (name) => {
  //   deleteAnalyticsProfile({
  //     name,
  //   })
  // }

  useDataLoadEffect(providerList, loadAnalyticsProviderList)

  useDataLoadEffect(analyticsProfileList, loadAnalyticsProfileList)

  return <div className="pt-3 pb-5 px-sm-5 px-4 text-f-md">
    <Row className="align-items-start pt-1">
      <Col md className="mr-auto" style={{ maxWidth: '50rem' }}>
        <h2 className="h5 mb-5">
          <img src={titleImage} height="" width="230" alt="Google Analytics" />
        </h2>
        <p className="mb-5">
          Fast sends data to Google Analytics from the actual activity on your site, no Javascript tag required.
          Fast sends actual transfer data so you get the most accurate reporting from your site.
        </p>
      </Col>
      <Col className="flex-grow-0 mb-5 mt-1">
        <Button
          color="primary"
          className="text-nowrap text-f-md"
          tag={Link}
          to="/analytics/create"
          >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create New Profile
        </Button>
      </Col>
    </Row>

    <h2 className="mb-3 text-f-gray8 text-f-sm">Analytics Profiles:</h2>

    {
      isLoading(analyticsProfileList.state) && <Spinner />
    }

    {
      (
        hasSucceeded(analyticsProfileList.state) &&
        analyticsProfileList.data.size > 0
      ) && analyticsProfileList.data.map(profile => {
        const provider = providerList.data && providerList.data.find(provider => provider.name === profile.provider)

        return <Row className="mb-3" key={profile.name}>
          <Col>
            <div className="d-flex flex-wrap align-items-center py-2 px-3 rounded-lg Profile bg-f-gray15">
              <div className="my-2 mr-4 rounded bg-white Profile-preview"></div>
              <div className="my-2 mr-auto">
                <h3 className="h6 mb-2 text-break">{profile.name}</h3>
                <div className="Site-details" style={{ fontSize: 0 }}>
                  {
                    provider && <span
                      className="mr-3 pr-3 border-right border-f-gray11 text-f-sm"
                    >
                      {provider.display}
                    </span>
                  }
                  <span className="mr-4 text-nowrap text-f-sm">Tracking ID # {profile.token}</span>
                </div>
              </div>
              <div className="d-flex align-items-center flex-wrap ml-sm-auto">
                <div className="rounded-circle mr-4 my-2 bg-white Profile-owner"></div>
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
              </div>
            </div>
          </Col>
        </Row>
      })
    }
  </div>
}

AccountAnalytics.propTypes = {
  providerList: ImmutablePropTypes.record.isRequired,
  analyticsProfileList: ImmutablePropTypes.record.isRequired,
  deleteProfileState: PropTypes.string.isRequired,
  loadAnalyticsProviderList: PropTypes.func.isRequired,
  loadAnalyticsProfileList: PropTypes.func.isRequired,
  deleteAnalyticsProfile: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  providerList: selectAnalyticsProviderList,
  analyticsProfileList: selectAnalyticsProfileList,
  deleteProfileState: selectDeleteProfileState,
})

const actions = {
  loadAnalyticsProviderList,
  loadAnalyticsProfileList,
  deleteAnalyticsProfile,
}

export default compose(
  connect(selector, actions),
)(AccountAnalytics)
