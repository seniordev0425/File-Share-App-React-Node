import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap'

import APIKeyForm from '../APIKeyForm'


export default function APIKeyModal(props) {
  const { open, onToggle, onSubmit } = props

  let submit

  const setSubmit = func => submit = func

  return <Modal isOpen={open} toggle={onToggle}>
    <ModalHeader>
      Create API Key
    </ModalHeader>
    <ModalBody>
      <APIKeyForm
        setSubmit={setSubmit}
        onSubmit={onSubmit}
      />
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        className="text-f-sm"
        onClick={(...args) => submit(...args)}
      >
        Create API Key
      </Button>
    </ModalFooter>
  </Modal>
}

APIKeyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
