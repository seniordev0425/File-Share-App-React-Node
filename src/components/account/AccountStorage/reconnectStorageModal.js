import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Modal, ModalHeader, ModalBody,
} from 'reactstrap'

import { isPending, hasSucceeded } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import {
  selectOAuthLink,
  loadOAuthLink,
  loadOAuthLinkReset,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'


export function ReconnectStorageModal(props) {
  const {
    open, storage,
    oauthLink, loadOAuthLink, loadOAuthLinkReset,
  } = props

  useEffect(() => {
    if (open) {
      loadOAuthLinkReset()
      loadOAuthLink({
        storage,
      })
    }
  }, [open])

  usePreviousValue(oauthLink, prev => {
    if (isPending(prev.state) && hasSucceeded(oauthLink.state)) {
      window.location.assign(oauthLink.data.redirect_url)
    }
  })

  return <Modal isOpen={open}>
    <ModalHeader tag="h6">
      Reconnecting cloud storage
    </ModalHeader>
    <ModalBody>
      <div className="pb-2">
        <Spinner />
      </div>
    </ModalBody>
  </Modal>
}

ReconnectStorageModal.propTypes = {
  open: PropTypes.bool,
  oauthLink: ImmutablePropTypes.record.isRequired,
  storage: PropTypes.string.isRequired,
  loadOAuthLink: PropTypes.func.isRequired,
  loadOAuthLinkReset: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  oauthLink: selectOAuthLink,
})

const actions = {
  loadOAuthLink,
  loadOAuthLinkReset,
}

export default compose(
  connect(selector, actions),
)(ReconnectStorageModal)
