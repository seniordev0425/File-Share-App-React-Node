import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Breadcrumb, BreadcrumbItem,
  ListGroup, Button,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSync, faFolder, faInfoCircle, faExternalLinkSquareAlt,
} from '@fortawesome/free-solid-svg-icons'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import { getIconForStorage } from 'utils/icons'
import { selectSiteDetail } from 'store/modules/sites'
import {
  selectCurrentContent,
  selectRootDetails,
  loadRootDetails,
  loadFolderContent,
  resetFolderContent,
} from 'store/modules/siteContent'
import {
  flushCache,
  precache,
  manualSync,
} from 'store/modules/siteUpdates'
import {
  selectStorageList,
  selectStorageDetail,
  loadStorageList,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'
import ConfirmationModal from 'components/common/ConfirmationModal'
import FileItem from './FileItem'
import EmptyList from './EmptyList'


export function SiteBrowse(props) {
  const {
    match, location,
    siteDetail, storageList, storageDetail, loadStorageList,
    rootDetails, loadRootDetails,
    content, loadFolderContent,
    flushCache, precache, manualSync,
  } = props
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const baseBrowsePath = `/sites/${match.params.server}/browse`
  const folderPath = location.pathname.replace(baseBrowsePath, '') || '/'
  const server = siteDetail.data.server

  useDataLoadEffect(
    rootDetails,
    loadRootDetails,
    () => ({
      server,
    })
  )

  useDataLoadEffect(
    content,
    loadFolderContent,
    () => ({
      server,
      path: folderPath,
    })
  )

  useDataLoadEffect(storageList, loadStorageList)

  usePreviousValue(location, prevLocation => {
    if (location.pathname !== prevLocation.pathname) {
      resetFolderContent()
      loadFolderContent({
        server,
        path: folderPath,
      })
    }
  })

  const getRouteForFolderPath = (path) => {
    if (path.substr(0, 1) !== '/') {
      path = '/' + path
    }
    return `/sites/${match.params.server}/browse${path}`
  }

  const handleClickSyncWithCloudStorage = () => flushCache({
    server,
    path: folderPath,
  })

  const handleClickPushToCDN = () => precache({
    server,
    path: folderPath,
  })

  const handleManualSync = () => manualSync({
    server,
    path: '',
  })

  const storage = storageList.data && storageList.data.find(storage => storage.name === siteDetail.data.storage)

  const folderPathElements = folderPath.split('/')
  if (folderPathElements.length > 1 && !folderPathElements[folderPathElements.length - 1]) {
    folderPathElements.pop()
  }

  const loaded = hasSucceeded(storageList.state) && hasSucceeded(content.state)

  return <div>
    {
      (
        !siteDetail.data.autoupdate && storage
      ) &&
      <div className="d-inline-block rounded-lg px-3 py-2 mb-3 border border-f-gray13 bg-f-gray15 text-f-md text-f-gray3">
        <div className="d-inline-block my-2 mr-3">
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
          Automatic syncing disabled. To update this site, click this button:
        </div>
        <Button
          color="primary"
          className="my-2 text-f-sm"
          onClick={handleManualSync}
        >
          Sync from {storage.display}
        </Button>
      </div>
    }

    <div className="d-flex flex-wrap align-items-start pt-2 pb-3">
      <h2 className="h6 mb-2 py-2 pr-3 mr-auto">Browse Files</h2>
      <Button color="link" className="mb-2 mr-4 py-2 px-0 text-f-sm">
        <FontAwesomeIcon icon={faSync} className="mr-2" />
        Last sync 2/22/2019
      </Button>
      {
        (
          storageDetail.data && rootDetails.data
        ) && <Button
          tag="a"
          color="primary"
          outline
          className="mb-2 text-f-sm"
          href={rootDetails.data.details.origin_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View {storageDetail.data.display} Root
          <FontAwesomeIcon icon={faExternalLinkSquareAlt} size="sm" className="ml-2" />
        </Button>
      }
    </div>

    <Breadcrumb listClassName="m-0 Breadcrumb text-f-md bg-f-gray15">
      {
        folderPathElements.map((folder, index) => {
          const active = index === folderPathElements.length - 1
          const isRoot = index === 0
          return (
            <BreadcrumbItem key={`${folder}_index`} active={active}>
              {
                active && !isRoot ?
                <>
                  <FontAwesomeIcon icon={faFolder} className="mr-2" />
                  {folder}
                </>
                :
                <Link to={getRouteForFolderPath(folderPathElements.slice(0, index + 1).join('/'))}>
                  {
                    isRoot ? (
                      storage ?
                      <>
                        <FontAwesomeIcon icon={getIconForStorage(storage.name)} className="mr-2" />
                        {storage.display}
                      </> :
                      <>
                        <FontAwesomeIcon icon={faFolder} className="mr-2" />
                        Root
                      </>
                    ) :
                    <>
                      <FontAwesomeIcon icon={faFolder} className="mr-2" />
                      {folder}
                    </>
                  }
                </Link>
              }
            </BreadcrumbItem>
          )
        })
      }
    </Breadcrumb>

    {
      !loaded && <Spinner />
    }

    {
      loaded && (
        content.data.size > 0 ?
        <ListGroup flush className="DataList">
          {
            content.data.map(record => (
              <FileItem
                key={record.id}
                record={record}
                storageName={storage.display}
                pathGenerator={getRouteForFolderPath}
                onSyncWithStorage={() => setOpenConfirmationModal(true)}
                onPushToCDN={handleClickPushToCDN}
              />
            ))
          }
        </ListGroup> :
        <EmptyList
          server={server}
          path={folderPath}
          storage={storageDetail.data}
        />
      )
    }

    <ConfirmationModal
      open={openConfirmationModal}
      heading="Sync from Cloud Storage"
      message={
        'Syncing will clear all data from CDN. This should only be used if you ' +
        'feel your content may not have been updated correctly. ' +
        'Are you sure you like to manually sync from your cloud storage now?'
      }
      onConfirm={handleClickSyncWithCloudStorage}
      onClose={() => setOpenConfirmationModal(false)}
      confirmText="Yes"
      cancelText="Cancel"
    />
  </div>
}

SiteBrowse.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  siteDetail: ImmutablePropTypes.record.isRequired,
  rootDetails: ImmutablePropTypes.record.isRequired,
  content: ImmutablePropTypes.record.isRequired,
  storageList: ImmutablePropTypes.record.isRequired,
  storageDetail: ImmutablePropTypes.record.isRequired,
  loadRootDetails: PropTypes.func.isRequired,
  loadFolderContent: PropTypes.func.isRequired,
  resetFolderContent: PropTypes.func.isRequired,
  loadStorageList: PropTypes.func.isRequired,
  flushCache: PropTypes.func.isRequired,
  precache: PropTypes.func.isRequired,
  manualSync: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  rootDetails: selectRootDetails,
  content: selectCurrentContent,
  storageList: selectStorageList,
  storageDetail: selectStorageDetail,
})

const actions = {
  loadRootDetails,
  loadFolderContent,
  resetFolderContent,
  loadStorageList,
  flushCache,
  precache,
  manualSync,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SiteBrowse)
