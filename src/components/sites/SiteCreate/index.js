import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import { Button, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faCheckCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { NEW_SITE_CDN } from 'constants/common'
import { isPending, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectCreateSiteState,
  selectSiteList,
  createSite,
  createSiteResetState,
} from 'store/modules/sites'
import {
  selectRootDetails,
  loadRootDetails,
  loadRootDetailsReset,
} from 'store/modules/siteContent'
import {
  selectMyStorageList,
  loadMyStorageList,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'
import SiteCreateForm from '../SiteCreateForm'


const websiteConfigPresets = {
  website: {
    fancyindexing: false,
    indexfiles: true,
    search: true,
    expires: 24 * 3600,
    autoupdate: true,
    precache: true,
    precachedata: true,
  },
  ftp: {
    fancyindexing: true,
    indexfiles: false,
    search: true,
    expires: 30 * 24 * 3600,
    autoupdate: true,
    precache: true,
    precachedata: true,
  },
  downloads: {
    fancyindexing: false,
    indexfiles: false,
    search: true,
    expires: 30 * 24 * 3600,
    autoupdate: true,
    precache: true,
    precachedata: true,
  },
}

export function SiteCreate(props) {
  const {
    history, siteList,
    myStorageList, loadMyStorageList,
    createSite, createSiteState, createSiteResetState,
    rootDetails, loadRootDetails, loadRootDetailsReset,
  } = props
  const [submittedData, setSubmittedData] = useState(null)
  const createdSite = submittedData && siteList.data && siteList.data.find(
    site => site.name === submittedData.name
  )

  const goToDashboard = () => {
    history.push('/sites')
  }

  const handleSubmit = data => {
    const siteCreateData = {
      name: data.name,
      desc: data.desc,
      analytics: 'null',
      storage: data.storage,
      cdn: NEW_SITE_CDN,
      image_polish: true,
      ...websiteConfigPresets[data.websiteConfig],
    }
    loadRootDetailsReset()
    setSubmittedData(siteCreateData)
    createSite({
      data: siteCreateData
    })
  }

  const handleCancel = () => goToDashboard()

  useDataLoadEffect(myStorageList, loadMyStorageList)

  useEffect(() => createSiteResetState, [])

  useEffect(() => {
    if (hasSucceeded(createSiteState) && createdSite) {
      loadRootDetails({
        server: createdSite.server,
      })
    }
  }, [createSiteState, createdSite])

  const submitting = (
    isPending(createSiteState) ||
    isPending(siteList) || (
      submittedData &&
      !hasSucceeded(rootDetails.state)
    ) // To prevent enabling create site button momentarily
  )

  const submitted = (
    hasSucceeded(createSiteState) &&
    hasSucceeded(rootDetails.state)
  )

  const usedStorage = submittedData && myStorageList.data && myStorageList.data.find(
    storage => storage.name === submittedData.storage
  )

  return <div>
    <Button tag={Link} to="/sites" outline color="primary" className="border-0 mt-3 ml-3 BackButton text-f-md">
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" aria-hidden="true" />
      Back To Home
    </Button>

    {
      !hasSucceeded(myStorageList.state) && <Spinner />
    }

    {
      hasSucceeded(myStorageList.state) && !myStorageList.data.size && <section className="p-5">
        <h1 className="h6">You need to have at least one cloud storage provider linked to your account.</h1>
      </section>
    }

    {
      hasSucceeded(myStorageList.state) && myStorageList.data.size > 0 && <section className="p-5">
        <SiteCreateForm
          initialValues={
            myStorageList.data.size === 1 ?
            {
              storage: myStorageList.data.get(0).name,
            } :
            null
          }
          storageList={myStorageList.data}
          submitting={submitting}
          submitted={submitted}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          renderConfirmationPage={() => createdSite && usedStorage && <Row>
            <Col className="d-flex flex-column text-center mx-auto" style={{ maxWidth: '45rem' }}>
              <h1 className="h4 mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" aria-hidden />
                Successfully created website
              </h1>
              <p className="mb-5">
                There is now a folder in your {usedStorage.display} named "{createdSite.server}".
                Anything you put into that folder will sync to your website at <a
                  href={createdSite.server}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {createdSite.server}
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1"  />
                </a>.
              </p>
              <div className={cx(
                'd-flex flex-sm-row flex-column',
                'align-items-sm-start align-items-center justify-content-center',
                'pb-5 mb-4 border-bottom',
                'SiteCreatedGraphic border-f-gray13',
              )}>
                <div className={`SiteCreatedGraphic-${createdSite.storage}`}>
                  <a
                    href={rootDetails.data.details.origin_url}
                    className="text-f-sm text-f-gray8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See your {usedStorage.display}
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1"  />
                  </a>
                </div>
                <div className="SiteCreatedGraphic-arrow my-1"></div>
                <div className="SiteCreatedGraphic-website">
                  <a
                    href={createdSite.server}
                    className="text-f-sm text-f-gray8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View your website
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1"  />
                  </a>
                </div>
              </div>
              <Button tag={Link} to="/sites" color="primary" className="ml-auto">
                Done
              </Button>
            </Col>
          </Row>}
        />
      </section>
    }
  </div>
}

SiteCreate.propTypes = {
  history: PropTypes.object.isRequired,
  myStorageList: ImmutablePropTypes.record.isRequired,
  createSiteState: PropTypes.string.isRequired,
  siteList: ImmutablePropTypes.record.isRequired,
  rootDetails: ImmutablePropTypes.record.isRequired,
  loadMyStorageList: PropTypes.func.isRequired,
  createSite: PropTypes.func.isRequired,
  createSiteResetState: PropTypes.func.isRequired,
  loadRootDetails: PropTypes.func.isRequired,
  loadRootDetailsReset: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  myStorageList: selectMyStorageList,
  createSiteState: selectCreateSiteState,
  siteList: selectSiteList,
  rootDetails: selectRootDetails,
})

const actions = {
  loadMyStorageList,
  createSite,
  createSiteResetState,
  loadRootDetails,
  loadRootDetailsReset,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SiteCreate)
