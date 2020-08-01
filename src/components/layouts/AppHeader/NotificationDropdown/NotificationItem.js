import React, { useState } from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle, faExclamationTriangle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { NOTIFICATION_ACKNOWLEDGE_TIMEOUT } from 'constants/env'
import { parseDate } from 'utils/format'


const ICONS = {
  notice: faCheckCircle,
  warning: faExclamationTriangle,
  error: faTimesCircle,
}

const ICON_COLOR = {
  notice: 'text-f-color2',
  warning: 'text-f-color4',
  error: 'text-f-color6',
}

function NotificationItem(props) {
  const { notification, onAcknowledge } = props
  const [acknowledgeTimer, setAcknowledgeTimer] = useState(null)

  const handleChangeVisibility = isVisible => {
    if (isVisible) {
      if (onAcknowledge && !acknowledgeTimer) {
        setAcknowledgeTimer(setTimeout(() => {
          onAcknowledge(notification)
          setAcknowledgeTimer(null)
        }, NOTIFICATION_ACKNOWLEDGE_TIMEOUT))
      }
    } else {
      if (acknowledgeTimer) {
        clearTimeout(acknowledgeTimer)
        setAcknowledgeTimer(null)
      }
    }
  }

  return <VisibilitySensor
    active={!notification.acknowledged}
    onChange={handleChangeVisibility}
  >
    <div className="d-flex p-4 border-bottom border-f-gray13 EventItem">
      <FontAwesomeIcon
        icon={ICONS[notification.category]}
        className={cx('mr-3', ICON_COLOR[notification.category])}
      />
      <div>
        <h2 className="mb-1 text-f-sm">{notification.subject}</h2>
        <div className="mb-3 text-f-sm text-f-gray8">
          {parseDate(notification.created).fromNow()}
        </div>
        <p className="mb-0 text-f-gray6 text-f-sm">
          <span dangerouslySetInnerHTML={{ __html: notification.desc }} />
        </p>
      </div>
    </div>
  </VisibilitySensor>
}

NotificationItem.propTypes = {
  notification: ImmutablePropTypes.record.isRequired,
  onAcknowledge: PropTypes.func,
}

export default NotificationItem
