import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap'


export default class ConfirmationModal extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    heading: PropTypes.string,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmButtonColor: PropTypes.string,
  }

  static defaultProps = {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonColor: 'primary'
  }

  handleConfirm = () => {
    const { onConfirm, onClose } = this.props
    onConfirm()
    onClose()
  }

  render() {
    const { open, heading, message, onClose, confirmText, cancelText, confirmButtonColor } = this.props

    return <Modal isOpen={open} toggle={onClose}>
      {
        heading && <ModalHeader tag="h6">
          {heading}
        </ModalHeader>
      }
      <ModalBody className="text-f-md">
        {message}
      </ModalBody>
      <ModalFooter>
        <Button color={confirmButtonColor} className="text-f-md" onClick={this.handleConfirm}>
          {confirmText || 'Confirm'}
        </Button>
        <Button color="secondary" className="text-f-md" onClick={onClose}>
          {cancelText || 'Cancel'}
        </Button>
      </ModalFooter>
    </Modal>
  }
}
