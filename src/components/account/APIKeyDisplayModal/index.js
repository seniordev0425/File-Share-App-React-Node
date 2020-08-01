import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap'


function APIKeyDisplayModal(props) {
  const { open, onToggle, apiKey } = props

  return <Modal isOpen={open} toggle={onToggle}>
    <ModalHeader>
      API key created
    </ModalHeader>
    <ModalBody>
      Created API Key: <br />
      <pre>{apiKey}</pre>
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        className="text-f-sm"
        onClick={onToggle}
      >
        Close
      </Button>
    </ModalFooter>
  </Modal>
}

APIKeyDisplayModal.propTypes = {
  open: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
}

export default APIKeyDisplayModal
