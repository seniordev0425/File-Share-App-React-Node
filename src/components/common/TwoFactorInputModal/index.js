import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connectModal } from 'redux-modal'
import {
  Modal, ModalHeader, ModalBody,
} from 'reactstrap'

import { selectModal } from 'store/modules/modal'
import CodeFromAuthy from './CodeFromAuthy'
import CodeFromSMS from './CodeFromSMS'
import CodeFromCall from './CodeFromCall'
import { TWOFACTOR_MODE } from './constants'


export const TwoFactorInputModal = ({
  show,
  handleHide,
  onSubmit,
  onClose,
}) => {
  const [twoFactorMode, setTwoFactorMode] = useState(TWOFACTOR_MODE.AUTHY)

  const handleSubmit = data => {
    handleHide()
    onSubmit && onSubmit(data)
  }

  const handleClose = () => {
    handleHide()
    onClose && onClose()
  }

  return <Modal isOpen={show} toggle={handleClose}>
    <ModalHeader className="text-f-md px-4 py-3">
      Enter Two-Factor Authentication Code
    </ModalHeader>
    <ModalBody className="text-f-md p-4">
      {
        twoFactorMode === TWOFACTOR_MODE.AUTHY && <CodeFromAuthy
          onSubmit={handleSubmit}
          setTwoFactorMode={setTwoFactorMode}
        />
      }

      {
        twoFactorMode === TWOFACTOR_MODE.SMS && <CodeFromSMS
          onSubmit={handleSubmit}
          setTwoFactorMode={setTwoFactorMode}
        />
      }

      {
        twoFactorMode === TWOFACTOR_MODE.CALL && <CodeFromCall
          onSubmit={handleSubmit}
          setTwoFactorMode={setTwoFactorMode}
        />
      }
    </ModalBody>
  </Modal>
}

TwoFactorInputModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default connectModal({
  name: 'twoFactorInputModal',
  destroyOnHide: false,
  getModalState: selectModal
})(TwoFactorInputModal)
