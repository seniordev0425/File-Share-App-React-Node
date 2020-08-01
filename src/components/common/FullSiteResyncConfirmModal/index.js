import React from 'react'
import PropTypes from 'prop-types'
import { connectModal } from 'redux-modal'

import { selectModal } from 'store/modules/modal'
import ConfirmationModal from 'components/common/ConfirmationModal'


export function FullSiteResyncConfirmModal(props) {
  const {
    show, handleHide, onSubmit,
  } = props

  const handleSubmit = value => {
    handleHide()
    onSubmit(value)
  }

  return <ConfirmationModal
    open={show}
    heading="All site data will be re-synced from cloud storage."
    message="The change you are requesting will sync the entire site and all of its files. If you have a lot of files, this can take a while. Data transfer rates apply."
    onConfirm={() => handleSubmit(true)}
    onClose={() => handleSubmit(false)}
    confirmText="Continue"
    cancelText="Cancel"
  />
}

FullSiteResyncConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default connectModal({
  name: 'fullSiteResyncConfirmModal',
  destroyOnHide: false,
  getModalState: selectModal,
})(FullSiteResyncConfirmModal)
