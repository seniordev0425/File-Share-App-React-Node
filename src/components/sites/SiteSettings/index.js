import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft, faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'

import { getSiteTitle } from 'utils/format'
import { isLoading, hasFailed, hasSucceeded, isPending, isNotFoundStatus } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import {
  selectUser,
} from 'store/modules/user'
import {
  selectSiteDetail,
  loadSiteDetail,
  updateSiteDetail,
  deleteSiteDetail,
  selectUpdateSiteDetailState,
  selectSitePreviewMap,
  loadSitePreview,
  selectDeleteSiteDetailState,
} from 'store/modules/sites'
import {
  selectMyStorageList,
  loadMyStorageList,
} from 'store/modules/storage'
import {
  loadPlan,
  selectPlan,
} from 'store/modules/billing'
import NotFound from 'components/common/NotFound'
import Spinner from 'components/common/Spinner'
import ConfirmationModal from 'components/common/ConfirmationModal'
import SitePreview from 'components/sites/SitePreview'
import SiteSettingsForm from '../SiteSettingsForm'


export function SiteSettings(props) {
  const {
    match, history,
    user,
    plan, loadPlan,
    myStorageList, loadMyStorageList,
    siteDetail, updateSiteDetailState, updateSiteDetail,
    loadSitePreview, sitePreviewMap,
    deleteSiteDetail, deleteSiteDetailState,
  } = props

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [confirmationModalProps, setConfirmationModalProps] = useState({
    message: '',
  })

  const server = match.params.server
  const sitePreview = sitePreviewMap.get(server)
  const previewUrl = sitePreview && hasSucceeded(sitePreview.state) ? sitePreview.data.url : ''

  const handleOpenDisableConfirmationModal = () => {
    setOpenConfirmationModal(true)
    setConfirmationModalProps({
      heading: siteDetail.data.enabled ? 'Disable this site' : 'Enable this site',
      message: 'Are you sure?',
      onConfirm: handleToggleDisableSite
    })
  }

  const handleOpenPermanentlyDeleteConfirmationModal = () => {
    setOpenConfirmationModal(true)
    setConfirmationModalProps({
      heading: 'Warning',
      message: 'Are you sure to permanently delete site? You won\'t be able to restore its content.',
      onConfirm: () => deleteSiteDetail({
        server,
      })
    })
  }

  const handleConfirm = () => {
    alert('Confirmed!')
  }

  const handleCloseConfirmationModal = () => setOpenConfirmationModal(false)

  const handleSaveSettings = (data) => {
    updateSiteDetail({
      server,
      data,
    })
  }

  const handleToggleDisableSite = () => {
    const { enabled } = siteDetail.data
    updateSiteDetail({
      server,
      data: { enabled: !enabled },
      meta: {
        successMessage: `This site has been ${enabled ? 'disabled' : 'enabled'}.`
      }
    })
  }

  useDataLoadEffect(
    siteDetail,
    loadSiteDetail,
    () => ({
      server,
    })
  )

  useDataLoadEffect(
    sitePreview,
    loadSitePreview,
    () => ({
      server,
    }),
    needsLoading => (
      needsLoading &&
      siteDetail.data &&
      siteDetail.data.server === server &&
      siteDetail.data.enabled
    ),
    [siteDetail]
  )

  useDataLoadEffect(plan, loadPlan)

  useDataLoadEffect(myStorageList, loadMyStorageList)

  usePreviousValue(deleteSiteDetailState, prev => {
    if (isPending(prev) && hasSucceeded(deleteSiteDetailState)) {
      history.push('/sites')
    }
  })

  return <>
    {
      (
        isLoading(siteDetail.state) ||
        isLoading(myStorageList.state)
      ) && <Spinner />
    }

    {
      (
        hasFailed(siteDetail.state) ||
        hasFailed(myStorageList.state)
      ) && (
        isNotFoundStatus(siteDetail.statusCode)
        ? <NotFound />
        : <Spinner />
      )
    }

    {
      (
        hasSucceeded(siteDetail.state) &&
        hasSucceeded(myStorageList.state)
      ) && <>
        <Button
          color="primary"
          outline
          className="border-0 mt-3 ml-3 BackButton text-f-md"
          tag={Link}
          to={`/sites/${server}`}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />Back to Site
        </Button>

        <Container fluid className="p-0 pt-1 EditSite">
          <section className="px-sm-5 px-4 pt-5 pb-1 Site-heading">
            <div className="d-md-flex flex-wrap align-items-start">
              <div className="d-inline-block mr-md-4 mr-3 mb-4 rounded Site-preview align-top">
                <SitePreview imageUrl={previewUrl} />
              </div>
              <div className="d-inline-block mb-4">
                <h1 className="d-flex my-1 h4 align-items-center">Settings for {getSiteTitle(siteDetail.data)}</h1>
                <div className="Site-details">
                  <a href={`https://${siteDetail.data.server}`} target="_blank" rel="noopener noreferrer" className="align-bottom">
                    https://{siteDetail.data.server}
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="fa-external-link-alt ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <SiteSettingsForm
            initialValues={siteDetail.data.toJS()}
            user={user.data}
            plan={plan.data}
            storageList={myStorageList.data}
            submitting={isPending(updateSiteDetailState)}
            onSubmit={handleSaveSettings}
            onToggleDisable={handleOpenDisableConfirmationModal}
            onPermanentlyDelete={handleOpenPermanentlyDeleteConfirmationModal}
          />
        </Container>
      </>
    }

    <ConfirmationModal
      open={openConfirmationModal}
      onConfirm={handleConfirm}
      onClose={handleCloseConfirmationModal}
      {...confirmationModalProps}
    />
  </>
}

SiteSettings.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  plan: ImmutablePropTypes.record.isRequired,
  siteDetail: ImmutablePropTypes.record.isRequired,
  sitePreviewMap: ImmutablePropTypes.map.isRequired,
  myStorageList: ImmutablePropTypes.record.isRequired,
  updateSiteDetailState: PropTypes.string.isRequired,
  deleteSiteDetailState: PropTypes.string.isRequired,
  loadPlan: PropTypes.func.isRequired,
  loadSiteDetail: PropTypes.func.isRequired,
  loadSitePreview: PropTypes.func.isRequired,
  loadMyStorageList: PropTypes.func.isRequired,
  updateSiteDetail: PropTypes.func.isRequired,
  deleteSiteDetail: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  plan: selectPlan,
  siteDetail: selectSiteDetail,
  sitePreviewMap: selectSitePreviewMap,
  myStorageList: selectMyStorageList,
  updateSiteDetailState: selectUpdateSiteDetailState,
  deleteSiteDetailState: selectDeleteSiteDetailState,
})

const actions = {
  loadPlan,
  loadSiteDetail,
  loadSitePreview,
  loadMyStorageList,
  updateSiteDetail,
  deleteSiteDetail,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SiteSettings)
