import React from 'react'
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap'

import { hasSucceeded } from 'utils/state'
import Spinner from 'components/common/Spinner'


export default ({ open, onToggle, systemStatus, frontendVersion }) => (
  <Modal isOpen={open} toggle={onToggle}>
    <ModalHeader className="text-f-md">
      Platform Status
    </ModalHeader>

    <ModalBody className="text-f-md">
      {
        !hasSucceeded(systemStatus.state) && <Spinner />
      }

      {
        hasSucceeded(systemStatus.state) && <>
          <p>App: {systemStatus.data.app}</p>
          <p>API: {systemStatus.data.api}</p>
          <p>CDN: {systemStatus.data.cdn}</p>
          <p>Analytics: {systemStatus.data.analytics}</p>
          <p>Platform Version: {systemStatus.data.version}</p>
          <p>Frontend Version: {frontendVersion}</p>
        </>
      }
    </ModalBody>

    <ModalFooter>
      <Button color="primary" className="text-f-md" onClick={onToggle}>Dismiss</Button>
    </ModalFooter>
  </Modal>
)
