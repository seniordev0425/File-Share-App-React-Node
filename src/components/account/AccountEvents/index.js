import React, { useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Table } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { isPending, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { parseDate, getNotificationColorClassname } from 'utils/format'
import { getIconForNotificationType } from 'utils/icons'
import {
  selectEventList,
  selectAcknowledgeEventState,
  loadEventList,
  acknowledgeEvent,
} from 'store/modules/events'
import Spinner from 'components/common/Spinner'


export function AccountEvents(props) {
  const {
    eventList, loadEventList,
    acknowledgeEventState, acknowledgeEvent,
  } = props

  const unacknowledgedCount = useMemo(() => {
    if (!eventList.data) {
      return 0
    }
    return eventList.data.reduce((value, element) => value + (!element.acknowledged ? 1 : 0), 0)
  }, [eventList])

  const handleAcknowledgeEvent = (event) => acknowledgeEvent({
    eid: event.eid
  })

  const handleAcknowledgeAllEvents = () => acknowledgeEvent()

  useDataLoadEffect(eventList, loadEventList)

  return <div className="pt-3 pb-5 px-sm-5 px-4">
    <div className="d-flex flex-wrap align-items-center pb-3">
      <h2 className="h6 mr-auto my-3 pr-4">Events</h2>
      <div>
        <Button
          color="primary"
          className="my-2 text-f-md"
          disabled={!hasSucceeded(eventList.state) || !unacknowledgedCount || isPending(acknowledgeEventState)}
          onClick={handleAcknowledgeAllEvents}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          Acknowledge All Events
        </Button>
      </div>
    </div>

    {
      !hasSucceeded(eventList.state) && <Spinner />
    }

    {
      hasSucceeded(eventList.state) && <div className="TableScrollWrapper">
        <Table borderless className="Events-eventList">
          <thead className="border-bottom border-f-gray13">
            <tr>
              <th scope="col" className="pl-0 FilterMenu">
                <Button color="link" className="px-0">
                  Site
                </Button>
              </th>
              <th scope="col" className="FilterMenu">
                <Button color="link" className="px-0">
                  Subject
                </Button>
              </th>
              <th scope="col" className="FilterMenu">
                <Button color="link" className="px-0">
                  Date
                </Button>
              </th>
              <th scope="col" className="FilterMenu">
                <Button color="link" className="px-0">
                  Description
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="text-f-sm text-f-gray8">
            {
              eventList.data.map(event => {
                const trProps = !event.acknowledged ? {
                  style: { cursor: 'pointer' },
                  onClick: () => handleAcknowledgeEvent(event),
                } : {}

                return <tr
                  key={event.eid}
                  className={cx('border-bottom border-f-gray13', {
                    'is-new': !event.acknowledged,
                  })}
                  {...trProps}
                >
                  <td className="py-4 pl-4 font-weight-normal text-f-gray3 text-f-md">
                    {/* <h3 className="mb-1 text-f-md">Tom's Website</h3> */}
                    <span className="text-f-sm text-f-gray8">{event.server || '---'}</span>
                  </td>
                  <td className="py-4">
                    <FontAwesomeIcon
                      icon={getIconForNotificationType(event.category)}
                      className={cx('mr-2', getNotificationColorClassname(event.category))}
                    />
                    {event.subject}
                  </td>
                  <td className="py-4">
                    {parseDate(event.created).format('MMM Do, YYYY')}
                  </td>
                  <td className="py-4">
                    <span dangerouslySetInnerHTML={{ __html: event.desc }} />
                  </td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    }
  </div>
}

AccountEvents.propTypes = {
  eventList: ImmutablePropTypes.record.isRequired,
  acknowledgeEventState: PropTypes.string.isRequired,
  loadEventList: PropTypes.func.isRequired,
  acknowledgeEvent: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  eventList: selectEventList,
  acknowledgeEventState: selectAcknowledgeEventState,
})

const actions = {
  loadEventList,
  acknowledgeEvent,
}

export default compose(
  connect(selector, actions),
)(AccountEvents)
