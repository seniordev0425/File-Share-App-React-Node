import React, { useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle, faExclamationTriangle, faTimesCircle, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { formatRelativeTime } from 'utils/format'

import {
  selectNotificationList,
  push,
  pop,
} from 'store/modules/notifications'
import {
  setReportingError,
} from 'store/modules/log'
import './index.css'

const HEADER = {
  danger: {
    text: 'Error',
    icon: faTimesCircle,
    color: 'text-f-color6',
  },
  info: {
    text: 'Info',
    icon: faInfoCircle,
    color: 'text-f-gray3',
  },
  success: {
    text: 'Confirmation',
    icon: faCheckCircle,
    color: 'text-f-color2',
  },
  warning: {
    text: 'Warning',
    icon: faExclamationTriangle,
    color: 'text-f-color4',
  },
}

const getHeaderInfo = (type) => HEADER[type] || HEADER.info

function NotificationMonitor(props) {
  const { history, notificationList, pop, setReportingError } = props

  const handleDismiss = id => () => pop(id)

  const notificationListToShow = useMemo(() => (
    notificationList.slice(-5)
  ), [notificationList])

  const reportError = (ev, error) => {
    ev.preventDefault()

    setReportingError(error)
    history.push('/report-error')
  }

  return (
    <div className="notificationListArea">
      {
        notificationListToShow.map(notification => (
          <Toast key={notification.id} isOpen>
            <ToastHeader
              toggle={handleDismiss(notification.id)}
              close={(
                <>
                  <small className="text-muted text-nowrap">
                    {formatRelativeTime(notification.createdAt)}
                  </small>
                  <button
                    type="button"
                    className="ml-2 close"
                    onClick={handleDismiss(notification.id)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </>
              )}
            >
              <FontAwesomeIcon
                icon={getHeaderInfo(notification.type).icon}
                className={cx("mr-2", getHeaderInfo(notification.type).color)}
              />
              <strong className="mr-auto pr-3">
                {getHeaderInfo(notification.type).text}
              </strong>
            </ToastHeader>
            <ToastBody>
              {notification.message}

              {
                notification.error && <a
                  className="ml-2"
                  href="/"
                  onClick={ev => reportError(ev, notification.error)}
                >
                  Report
                </a>
              }
            </ToastBody>
          </Toast>
        ))
      }
    </div>
  )
}

NotificationMonitor.propTypes = {
  history: PropTypes.object.isRequired,
  notificationList: ImmutablePropTypes.list.isRequired,
  push: PropTypes.func.isRequired,
  pop: PropTypes.func.isRequired,
  setReportingError: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  notificationList: selectNotificationList,
})

const actions = {
  push,
  pop,
  setReportingError,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(NotificationMonitor)
