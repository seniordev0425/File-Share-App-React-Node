import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connectModal } from 'redux-modal'
import { Link } from 'react-router-dom'
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap'

import {
  selectSiteDetail,
} from 'store/modules/sites'
import {
  AUTOUPDATE_STATUS,
  selectStorageDetail,
} from 'store/modules/storage'
import { selectModal } from 'store/modules/modal'


export function ManualSyncModal(props) {
  const {
    show, handleHide,
    siteDetail, storageDetail,
    onSubmit,
  } = props

  const handleSubmit = value => {
    handleHide()
    onSubmit(value)
  }

  const autoUpdateSupported = storageDetail.data.autoupdate === AUTOUPDATE_STATUS.AVAILABLE

  return <Modal isOpen={show} toggle={handleHide}>
    <ModalHeader tag="h6">
      Would you like to manually sync this site?
    </ModalHeader>
    <ModalBody className="text-f-md">
      {
        siteDetail.data.autoupdate && <>
          <p>
            You have enabled automatic syncing in this site. That means any update you make to this site's files on {storageDetail.data.display} will sync automatically to Fast.io.
          </p>
          <p>
            If you believe your files may be out of sync, you can manually sync the entire site and all of its files by clicking the button below. If you have a lot of files, this can take a while. Data transfer rates apply.
          </p>
        </>
      }

      {
        (autoUpdateSupported && !siteDetail.data.autoupdate) && <>
          <p>
            You have disabled automatic syncing in this site. You can sync the entire site and all of its files by clicking the button below. Data transfer rates apply.
          </p>
          <p>
            Alternatively you can enable automatic updates on the site <Link
              to={`/sites/${siteDetail.data.server}/settings`}
              onClick={handleHide}
            >
              settings page
            </Link>.
          </p>
        </>
      }

      {
        !autoUpdateSupported && <p>
          Automatic syncing is currently not available for sites connected to {storageDetail.data.display}. In order to update your site, you can either sync individual files from the file browser or you can sync the entire site and all of its files by clicking the button below. Data transfer rates apply.
        </p>
      }
    </ModalBody>
    <ModalFooter>
      <Button color="primary" className="text-f-md" onClick={() => handleSubmit(true)}>
        Yes, I want to sync the entire site
      </Button>
      <Button color="link" className="text-f-md" onClick={() => handleSubmit(false)}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
}

ManualSyncModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  siteDetail: ImmutablePropTypes.record.isRequired,
  storageDetail: ImmutablePropTypes.record.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  storageDetail: selectStorageDetail,
})

export default compose(
  connectModal({
    name: 'manualSyncModal',
    destroyOnHide: false,
    getModalState: selectModal,
  }),
  connect(selector),
)(ManualSyncModal)
