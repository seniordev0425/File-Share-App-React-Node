import React, { useState, useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import {
  Button, Row, Col,
  Dropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell, faLongArrowAltDown, faEye,
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { needsLoading, isPending, hasSucceeded, hasFailed } from 'utils/state'
import {
  selectNotificationList,
  loadNotificationList,
  acknowledgeEvent,
} from 'store/modules/events'
import Spinner from 'components/common/Spinner'
import NotificationItem from './NotificationItem'


export function Notification(props) {
  const { notificationList, loadNotificationList, acknowledgeEvent } = props
  const [openDropdown, setOpenDropdown] = useState(false)
  const [limit, setLimit] = useState(3)
  const [loadedNotifications, setLoadedNotifications] = useState(null)

  const handleToggleDropdown = () => setOpenDropdown(value => !value)

  const handleLoadMore = () => setLimit(value => value + 3)

  const handleAcknowledge = notification => acknowledgeEvent({
    eid: notification.eid,
  })

  const notificationStatus = useMemo(() => {
    if (!loadedNotifications) {
      return ''
    }

    let status = ''
    loadedNotifications.forEach(notification => {
      if (notification.acknowledged) {
        return
      }

      if (notification.category === 'error') {
        status = 'has-errors'
      } else if (notification.category === 'warning' && status !== 'has-errors') {
        status = 'has-warnings'
      } else if (notification.category === 'notice' && !status) {
        status = 'has-info'
      }
    })
    return status
  }, [loadedNotifications])

  useEffect(() => {
    if (openDropdown && needsLoading(notificationList.state) && !hasFailed(notificationList.state)) {
      loadNotificationList({
        limit,
      })
    }
  }, [openDropdown])

  useEffect(() => {
    loadNotificationList({
      limit,
    })
  }, [limit])

  useEffect(() => {
    if (hasSucceeded(notificationList.state)) {
      setLoadedNotifications(notificationList.data)
    }
  }, [notificationList])

  return <Dropdown
    isOpen={openDropdown}
    toggle={handleToggleDropdown}
    nav
    inNavbar
    className={cx('EventsMenu', notificationStatus)}
  >
    <div className="position-absolute rounded-circle EventsMenu-status" />
    <DropdownToggle nav className="btn IconButton">
      <FontAwesomeIcon icon={faBell} />
    </DropdownToggle>
    <DropdownMenu right>
      <h1 className="mb-0 mt-n2 p-3 text-white rounded-top border-bottom border-f-gray13 bg-f-gray3 text-f-md">
        Events <span className="text-f-gray8">(3)</span>
      </h1>

      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {
          !loadedNotifications && <Spinner />
        }

        {
          loadedNotifications && loadedNotifications.map(notification => <NotificationItem
            key={notification.eid}
            notification={notification}
            onAcknowledge={handleAcknowledge}
          />)
        }
      </div>

      <Row noGutters className="text-center py-2 mb-n2 rounded-bottom bg-f-gray16">
        <Col className="border-right border-f-gray13">
          <Button
            color="link"
            className="text-nowrap text-f-sm"
            onClick={handleLoadMore}
            disabled={isPending(notificationList.state)}
          >
            <FontAwesomeIcon icon={faLongArrowAltDown} className="mr-2" />
            Load More
          </Button>
        </Col>
        <Col>
          <Button
            color="link"
            className="text-nowrap text-f-sm"
            tag={Link}
            to="/account/events"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            View All
          </Button>
        </Col>
      </Row>
    </DropdownMenu>
  </Dropdown>
}

Notification.propTypes = {
  notificationList: ImmutablePropTypes.record.isRequired,
  loadNotificationList: PropTypes.func.isRequired,
  acknowledgeEvent: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  notificationList: selectNotificationList,
})

const actions = {
  loadNotificationList,
  acknowledgeEvent,
}

export default compose(
  connect(selector, actions),
)(Notification)
