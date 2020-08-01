import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Button, Navbar, Nav,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { hasSucceeded } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import { selectIsRefreshingVisibly } from 'store/modules/persist'
import Spinner from './DataRefreshSpinner'
import NotificationDropdown from './NotificationDropdown'
import SyncStatusDropdown from './SyncStatusDropdown'


function AppHeader(props) {
  const { user, userTitle, onClickToggle, onSignOut, isRefreshing } = props
  const [showSpinner, setShowSpinner] = useState(false)
  const [complete, setComplete] = useState(false)

  usePreviousValue(isRefreshing, prevIsRefreshing => {
    if (!showSpinner && isRefreshing) {
      setComplete(false)
      setShowSpinner(true)
    }

    if (prevIsRefreshing && !isRefreshing) {
      setComplete(true)
      setTimeout(() => setShowSpinner(false), 2500)
    }
  })

  return <div className="MainNav">
    <Navbar color="white" light expand className="justify-content-between fixed-top border-bottom px-2 border-f-gray13">
      <Nav className="mr-3 px-2 border-right MainMenu border-f-gray13" navbar>
        <Button color="link" className="IconButton" onClick={onClickToggle}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </Nav>
      <Link to="/" className="navbar-brand position-relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64">
          <path d="M54.7 26.5h-17l2-7.4h21.4L64 8H2.4C0 8-1 11.7 1.4 11.7h32.8c2.4 0 1.4 3.7-1 3.7H20.3c-2.4 0-3.4 3.7-1 3.7h4.8c2.4 0 1.4 3.7-1 3.7h-12c-2.4 0-3.4 3.7-1 3.7h12c2.4 0 1.4 3.7-1 3.7h-4c-2.4 0-3.4 3.7-1 3.7h6.7c2.4 0 1.4 3.7-1 3.7h-2.7c-2.3 8.6-3 11.2-4.9 18.5h15.6l4.9-18.3h17l3-11.3zm-43.8 3.7c2.4 0 1.4 3.7-1 3.7H6.5c-2.4 0-1.4-3.7 1-3.7h3.4zm2.8-14.8c2.4 0 1.4 3.7-1 3.7H3.4c-2.4 0-1.4-3.7 1-3.7h9.3z" />
        </svg>
        <span
          className="position-absolute text-uppercase font-weight-bold border rounded border-f-gray10 text-f-gray8"
          style={{
            fontSize: '.5rem',
            padding: '.05rem .25rem',
            left: '100%',
            top: 8,
            marginLeft: '.5rem'
          }}
        >
          Beta
        </span>
      </Link>
      <Nav className="ml-auto" navbar>
        <NotificationDropdown />

        <SyncStatusDropdown />

        {
          hasSucceeded(user.state) && <UncontrolledDropdown nav inNavbar className="ml-4 AccountMenu">
            {
              showSpinner ?
              <DropdownToggle tag="span">
                <Spinner complete={complete} />
              </DropdownToggle>
              :
              <DropdownToggle
                nav
                className="rounded-circle text-center d-flex text-f-sm"
                style={{ color: 'inherit', lineHeight: '28px' }}
              >
                <span className="m-auto">{userTitle}</span>
              </DropdownToggle>
            }
            <DropdownMenu right>
              <DropdownItem tag="a" href="#" className="text-light">
                {user.data.email_address}
              </DropdownItem>
              <DropdownItem tag={Link} to="/account/user" className="text-light">
                Account Settings
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem tag="a" href="#" onClick={onSignOut} className="text-light">
                <span>Sign Out</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        }
      </Nav>
    </Navbar>
  </div>
}

AppHeader.propTypes = {
  user: ImmutablePropTypes.record.isRequired,
  userTitle: PropTypes.string.isRequired,
  onClickToggle: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
}

const selector = createStructuredSelector({
  isRefreshing: selectIsRefreshingVisibly,
})

export default compose(
  connect(selector),
)(AppHeader)
