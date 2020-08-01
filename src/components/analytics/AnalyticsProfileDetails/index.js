import React, { useState, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Container, Row, Col, Button,
  ListGroup, ListGroupItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft, faStar, faExternalLinkAlt,
  faAngleRight, faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import { hasFailed, hasSucceeded, isPending, isNotFoundStatus } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import { getSiteTitle, parseDate } from 'utils/format'
import { getIconForStorage } from 'utils/icons'
import {
  selectAnalyticsProviderList,
  selectAnalyticsProfile,
  selectUpdateProfileState,
  selectDeleteProfileState,
  loadAnalyticsProviderList,
  loadAnalyticsProfile,
  updateAnalyticsProfile,
  deleteAnalyticsProfile,
} from 'store/modules/analytics'
import {
  selectSiteList,
  loadSiteList,
} from 'store/modules/sites'
import Spinner from 'components/common/Spinner'
import ConfirmationModal from 'components/common/ConfirmationModal'
import AnalyticsProfileDetailForm from './form'
import NotFound from 'components/common/NotFound'


export function AnalyticsProfileDetails(props) {
  const {
    history, match, profile, loadAnalyticsProfile,
    providerList, loadAnalyticsProviderList,
    siteList, loadSiteList,
    updateProfileState, updateAnalyticsProfile,
    deleteProfileState, deleteAnalyticsProfile,
  } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const profileName = match.params.name

  const toggleDeleteModal = () => setShowDeleteModal(value => !value)

  const handleSubmitForm = data => {
    updateAnalyticsProfile({
      name: profileName,
      data,
    })
  }

  const handleDeleteProfile = () => deleteAnalyticsProfile({
    name: profileName,
  })

  const provider = (profile.data && providerList.data) && providerList.data.find(provider =>
    provider.name === profile.data.provider)

  useDataLoadEffect(
    profile,
    loadAnalyticsProfile,
    () => ({
      name: profileName,
    }),
    needsLoading => needsLoading || (
      profile.data &&
      profile.data.name !== profileName
    ),
    [profileName]
  )

  useDataLoadEffect(providerList, loadAnalyticsProviderList)

  useDataLoadEffect(siteList, loadSiteList)

  usePreviousValue(deleteProfileState, prev => {
    if (isPending(prev) && hasSucceeded(deleteProfileState)) {
      history.push(`/analytics/${profile.data.name}/deleted`)
    }
  })

  const linkedSites = useMemo(
    () => (
      hasSucceeded(siteList.state) ?
      siteList.data.filter(site => site.analytics === profileName) :
      null
    ),
    [siteList]
  )

  return <>
    <Button outline color="primary" className="border-0 mt-3 ml-3 BackButton text-f-md" tag={Link} to="/account/analytics">
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Analytics
    </Button>

    <Container fluid className="p-0 pt-1">
      {
        isPending(profile.state) && <Spinner />
      }

      {
        hasFailed(profile.state) && (
          isNotFoundStatus(profile.statusCode)
          ? <NotFound />
          : <Spinner />
        )
      }

      {
        hasSucceeded(profile.state) && <>
          <section className="px-sm-5 px-4 py-4 Profile-heading">
            <div className="d-flex flex-wrap align-items-center">
              <div className="rounded align-top mr-4 my-2 Profile-preview"></div>
              <div className="mr-auto py-2 pr-3">
                <h1 className="h4 py-2 m-0">
                  <span className="d-inline-block align-middle py-1 pr-2">
                    {profile.data.name}
                  </span>
                  <Button
                    color="danger"
                    className="rounded-pill text-uppercase align-middle py-1 my-1"
                    style={{ fontSize: '.7rem' }}
                    onClick={toggleDeleteModal}
                    disabled={isPending(deleteProfileState)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </Button>
                </h1>
                <div className="py-2 Profile-details">
                  <span className="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2195.9 2430.9" height="18">
                      <path d="M2195.9 2126.7c.9 166.9-133.7 302.8-300.5 303.7-12.4.1-24.9-.6-37.2-2.1-154.8-22.9-268.2-157.6-264.4-314V316.1c-3.7-156.6 110-291.3 264.9-314 165.7-19.4 315.8 99.2 335.2 264.9 1.4 12.2 2.1 24.4 2 36.7v1823z" fill="#f9ab00"></path><path d="M301.1 1828.7c166.3 0 301.1 134.8 301.1 301.1s-134.8 301.1-301.1 301.1S0 2296.1 0 2129.8s134.8-301.1 301.1-301.1zm792.2-912.5c-167.1 9.2-296.7 149.3-292.8 316.6v808.7c0 219.5 96.6 352.7 238.1 381.1 163.3 33.1 322.4-72.4 355.5-235.7 4.1-20 6.1-40.3 6-60.7v-907.4c.3-166.9-134.7-302.4-301.6-302.7-1.7 0-3.5 0-5.2.1z" fill="#e37400">
                      </path>
                    </svg>
                  </span>
                  {
                    provider && <span>
                      {provider.display} | Tracking ID # {profile.data.token}
                    </span>
                  }
                </div>
              </div>
            </div>
          </section>

          <section className="pt-3 pb-5 px-3 mt-2 bg-f-gray15">
            <AnalyticsProfileDetailForm
              provider={provider}
              profile={profile.data}
              submitting={isPending(updateProfileState)}
              onSubmit={handleSubmitForm}
            />

            <Row noGutters className="pb-5">
              <Col lg="12" className="p-3">
                <div className="py-4 DetailBlock DataList">
                  <h2 className="h6 pb-4 px-4 mb-0 border-bottom DetailBlock-heading border-f-gray15">
                    Sites Using this Profile
                  </h2>

                  {
                    !hasSucceeded(siteList.state) && <Spinner />
                  }

                  {
                    hasSucceeded(siteList.state) && !linkedSites.size &&
                    <div className="pt-4 px-4 pb-0 text-f-sm">
                      No sites are using this profile yet.
                    </div>
                  }

                  {
                    hasSucceeded(siteList.state) && linkedSites.size > 0 && <ListGroup flush className="js-sites px-sm-5 px-4">
                      {
                        linkedSites.map(site => (
                          <ListGroupItem
                            key={site.server}
                            className="d-flex flex-wrap align-items-center py-2 px-0 Site"
                          >
                            <div className={cx({
                              'position-absolute rounded-circle align-self-md-center align-self-start mt-md-0 mt-2 ml-n3 Site-status': true,
                              'is-active': site.enabled,
                            })} />
                            <div className="my-2 mr-md-4 mr-2 rounded Site-preview">
                              <Button color="" className="Favorite">
                                <FontAwesomeIcon icon={faStar} />
                              </Button>
                            </div>
                            <div className="my-2 mr-auto">
                              <h3 className="mb-1 text-f-md">{getSiteTitle(site)}</h3>
                              <div className="Site-details">
                                <a className="d-sm-inline d-none" href="/">
                                  https://{site.server}
                                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1" />
                                </a>
                                <span className="ml-3 pl-3 border-left d-lg-inline d-none border-f-gray13">
                                  Updated: {parseDate(site.updated).format('MMM D, YYYY')}
                                </span>
                              </div>
                            </div>
                            <div className="rounded d-lg-block d-none Site-graphMini" />
                            <div className="ml-4 rounded-circle d-md-block d-none Site-owner" />
                            <div className="ml-4 text-center d-md-block d-none Site-storage">
                              <FontAwesomeIcon icon={getIconForStorage(site.storage)} size="lg" />
                            </div>
                            <Button
                              color=""
                              className="ml-md-5 ml-auto IconButton"
                              tag={Link}
                              to="/"
                            >
                              <FontAwesomeIcon icon={faAngleRight} />
                            </Button>
                          </ListGroupItem>
                        ))
                      }
                    </ListGroup>
                  }
                </div>
              </Col>
            </Row>
            <div className="p-5" />
          </section>

          <ConfirmationModal
            open={showDeleteModal}
            heading="Delete analytics profile?"
            message={`Are you sure you want to delete the analytics profile “${profile.data.name}”? This cannot be undone.`}
            onConfirm={handleDeleteProfile}
            onClose={toggleDeleteModal}
            confirmText="Delete"
            confirmButtonColor="danger"
          />
        </>
      }
    </Container>
  </>
}

AnalyticsProfileDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  providerList: ImmutablePropTypes.record.isRequired,
  profile: ImmutablePropTypes.record.isRequired,
  siteList: ImmutablePropTypes.record.isRequired,
  updateProfileState: PropTypes.string.isRequired,
  deleteProfileState: PropTypes.string.isRequired,
  loadAnalyticsProfile: PropTypes.func.isRequired,
  loadAnalyticsProviderList: PropTypes.func.isRequired,
  loadSiteList: PropTypes.func.isRequired,
  updateAnalyticsProfile: PropTypes.func.isRequired,
  deleteAnalyticsProfile: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  providerList: selectAnalyticsProviderList,
  profile: selectAnalyticsProfile,
  siteList: selectSiteList,
  updateProfileState: selectUpdateProfileState,
  deleteProfileState: selectDeleteProfileState,
})

const actions = {
  loadAnalyticsProfile,
  loadAnalyticsProviderList,
  loadSiteList,
  updateAnalyticsProfile,
  deleteAnalyticsProfile,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(AnalyticsProfileDetails)
