import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  ListGroupItem,
} from 'reactstrap'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import { parseDate, getNotificationColorClassname } from 'utils/format'
import { getIconForNotificationType } from 'utils/icons'


export default function EventListItem(props) {
  const { event, onAcknowledge } = props

  const showDropdown = !event.acknowledged

  return <ListGroupItem>
    <Row className="align-items-center">
      <Col lg className="pl-4">
        <FontAwesomeIcon
          icon={getIconForNotificationType(event.category)}
          className={cx('mr-2 ml-n4', getNotificationColorClassname(event.category))}
        />
        {event.subject}
        {/* <span dangerouslySetInnerHTML={{ __html: event.desc }} /> */}
      </Col>
      <Col lg="3" className="pl-4">
        Occurred: {parseDate(event.created).format('M/D/YY, H:ma')}
      </Col>
      <Col xs="auto" className="ml-auto pr-0">
        <UncontrolledDropdown style={{ visibility: showDropdown ? 'visible' : 'hidden' }}>
          <DropdownToggle tag="button" className="btn IconButton">
            <FontAwesomeIcon icon={faEllipsisH} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem
              onClick={() => showDropdown && onAcknowledge(event)}
            >
              Acknowledge
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </Row>
  </ListGroupItem>
}

EventListItem.propTypes = {
  event: ImmutablePropTypes.record.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
}
