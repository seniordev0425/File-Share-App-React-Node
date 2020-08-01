import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'

import { useDataLoadEffect } from 'utils/hooks'
import { logout } from 'store/modules/auth'
import {
  selectSystemStatus,
  loadSystemStatus,
} from 'store/modules/system'
import {
  selectUser,
  selectUserTitle,
  loadUser,
} from 'store/modules/user'
import AppHeader from '../AppHeader'
import Sidebar from '../Sidebar'
import './index.css'


export function OfflineNotice() {
  return <Alert color="warning" className="text-center">
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-f-color4 mr-2 d-none d-md-inline" />
    <strong>No internet connection detected.</strong> Make sure Wi-Fi or mobile data is turned on, then try again.
  </Alert>
}

export function AppLayout(props) {
  const {
    systemStatus, loadSystemStatus,
    user, userTitle, loadUser, children, logout,
  } = props
  const [showMenu, setShowMenu] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)

  const openMenu = () => setShowMenu(true)

  const closeMenu = () => setShowMenu(false)

  const handleOnline = () => setOnline(navigator.onLine)

  const handleOffline = () => setOnline(navigator.onLine)

  useDataLoadEffect(systemStatus, loadSystemStatus)

  useDataLoadEffect(user, loadUser)

  useEffect(() => {
    const _handleOnline = handleOnline
    const _handleOffline = handleOffline
    window.addEventListener('online', _handleOnline)
    window.addEventListener('offline', _handleOffline)
    return () => {
      window.removeEventListener('online', _handleOnline)
      window.removeEventListener('offline', _handleOffline)
    };
  }, [])

  return <div className="appLayout">
    <Sidebar open={showMenu} onClose={closeMenu} systemStatus={systemStatus} />

    <div className="appLayout__content-wrapper">
      <AppHeader
        user={user}
        userTitle={userTitle}
        onClickToggle={openMenu}
        onSignOut={logout}
      />

      {
        !online && <OfflineNotice />
      }

      <div className="appLayout__content">
        {children}
      </div>
    </div>
  </div>
}

AppLayout.propTypes = {
  systemStatus: ImmutablePropTypes.record.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  userTitle: PropTypes.string.isRequired,
  loadSystemStatus: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  systemStatus: selectSystemStatus,
  user: selectUser,
  userTitle: selectUserTitle,
})

const actions = {
  loadSystemStatus,
  loadUser,
  logout,
}

export default compose(
  connect(selector, actions),
)(AppLayout)
