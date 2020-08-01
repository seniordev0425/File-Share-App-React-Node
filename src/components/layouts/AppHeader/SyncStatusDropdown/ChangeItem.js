import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { JOB_STATES } from 'constants/common'
import {
  ICONS,
  ICON_COLOR_CLASSES,
  ITEM_CLASSES,
} from './constants'
import { parseDate } from 'utils/format'


export default function ChangeItem(props) {
  const {
    server, datetime, state, syncCount,
  } = props

  const icon = ICONS[state]

  return <div
    className={cx(
      'd-flex align-items-start p-4 border-bottom border-f-gray13 UpdateItem',
      ITEM_CLASSES[state],
    )}
  >
    <FontAwesomeIcon icon={icon} className={cx('mr-3', ICON_COLOR_CLASSES[state])} />
    <div className="flex-grow-1">
      <h2 className="mb-1 text-f-sm">
        {
          state === JOB_STATES.syncing && <span>
            Syncing cloud changes <span className="font-weight-light">for {server}</span>
          </span>
        }

        {
          state === JOB_STATES.pushing && <span>
            Pushing changes <span className="font-weight-light">to {server}</span>
          </span>
        }
        {
          state === JOB_STATES.complete && <span>
            Update complete <span className="font-weight-light">for {server}</span>
          </span>
        }
      </h2>
      <div className="mb-3 text-f-sm text-f-gray8">
        {parseDate(datetime).fromNow()}
      </div>

      <Row noGutters className="pt-2 UpdateItem-status">
        <Col sm className="d-flex align-items-center justify-content-sm-end py-2">
          <span className="ml-2 mr-sm-0 mr-2 order-sm-1 rounded-circle">
            <i className="spinner-border spinner-border-sm" role="status"></i>
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <div className="order-sm-0">Syncing {syncCount} changes</div>
        </Col>

        <Col sm className="d-flex align-items-center justify-content-sm-end py-2">
          <span className="ml-2 mr-sm-0 mr-2 order-sm-1 rounded-circle">
            <i className="spinner-border spinner-border-sm" role="status"></i>
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <div className="order-sm-0">Pushing to site</div>
        </Col>

        <Col sm className="d-flex align-items-center justify-content-sm-end py-2">
          <span className="ml-2 mr-sm-0 mr-2 order-sm-1 rounded-circle">
          <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <div className="order-sm-0">Update complete</div>
        </Col>
      </Row>
    </div>
  </div>
}

ChangeItem.propTypes = {
  server: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  syncCount: PropTypes.number.isRequired,
}
