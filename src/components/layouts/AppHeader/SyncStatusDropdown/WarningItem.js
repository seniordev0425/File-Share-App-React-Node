import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'
import cx from 'classnames'

import { JOB_STATES } from 'constants/common'
import {
  ICONS,
  ICON_COLOR_CLASSES,
  ITEM_CLASSES,
} from './constants'
import { parseDate } from 'utils/format'


function WarningItem(props) {
  const { server, datetime, stale, onClickComplete } = props
  const state = stale ? JOB_STATES.stale : JOB_STATES.warning
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
          stale ?
          <span>
            Sync stalled <span className="font-weight-light">for {server}</span>
          </span> :
          <span>
            Warning <span className="font-weight-light">for {server}</span>
          </span>
        }
      </h2>
      <div className="mb-3 text-f-sm text-f-gray8">
        {parseDate(datetime).fromNow()}
      </div>

      {
        !stale && <p className="mb-0 text-f-sm text-f-gray6">
          Short paragraph detailing this warning event...
        </p>
      }

      {
        stale && <Button
          color="primary"
          className="text-f-sm"
          onClick={() => onClickComplete(server)}
        >
          Complete Sync
        </Button>
      }
    </div>
  </div>
}

WarningItem.propTypes = {
  server: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
  stale: PropTypes.bool,
  onClickComplete: PropTypes.func,
}

export default WarningItem
