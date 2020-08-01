import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'

import { VERSION_CHECK_POLL_INTERVAL } from 'constants/common'
import { APP_VERSION } from 'constants/env'
import { hasSucceeded } from 'utils/state'
import {
  selectSystemStatus,
  loadSystemStatus,
} from 'store/modules/system'


export function VersionChecker(props) {
  const { systemStatus, loadSystemStatus } = props

  const reloadPage = ev => {
    ev.preventDefault()
    window.location.reload()
  }

  useEffect(() => {
    const timer = setInterval(loadSystemStatus, VERSION_CHECK_POLL_INTERVAL * 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const isOutdatedVersion = (
    hasSucceeded(systemStatus.state) &&
    APP_VERSION < systemStatus.data.frontEndVersion &&
    systemStatus.data.frontEndVersion !== 'unknown'
  )

  return isOutdatedVersion && <div
    style={{
      position: 'fixed',
      top: 80,
      left: '50%',
      width: 500,
      maxWidth: '95%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
    }}
  >
    <Toast className="w-100">
      <ToastHeader>
        A new version is available
      </ToastHeader>
      <ToastBody>
        A new version of Fast is available. Please reload this page.
        <div className="mt-3">
          <a href="/" onClick={reloadPage}>
            Click here to reload this page
          </a>
        </div>
      </ToastBody>
    </Toast>
  </div>
}

VersionChecker.propTypes = {
  systemStatus: ImmutablePropTypes.record.isRequired,
  loadSystemStatus: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  systemStatus: selectSystemStatus,
})

const actions = {
  loadSystemStatus,
}

export default compose(
  connect(selector, actions),
)(VersionChecker)
