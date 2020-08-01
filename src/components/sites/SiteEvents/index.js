import React, { useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Button, Table,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { isPending, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { parseDate, getNotificationColorClassname } from 'utils/format'
import { getIconForNotificationType } from 'utils/icons'
import { selectSiteDetail } from 'store/modules/sites'
import {
  selectSiteEventList,
  selectAcknowledgeEventState,
  loadSiteEventList,
  acknowledgeEvent,
  acknowledgeAllSiteEvents,
} from 'store/modules/events'
import Spinner from 'components/common/Spinner'


export function SiteEvents(props) {
  const {
    siteDetail,
    eventList, loadSiteEventList,
    acknowledgeEventState, acknowledgeEvent, acknowledgeAllSiteEvents,
  } = props
  const server = siteDetail.data.server

  const unacknowledgedCount = useMemo(() => {
    if (!eventList.data) {
      return 0
    }
    return eventList.data.reduce((value, element) => value + (!element.acknowledged ? 1 : 0), 0)
  }, [eventList])

  const handleAcknowledgeEvent = (event) => acknowledgeEvent({
    eid: event.eid
  })

  const handleAcknowledgeAllEvents = () => acknowledgeAllSiteEvents({
    server,
  })

  useDataLoadEffect(eventList, loadSiteEventList, () => ({
    server,
  }), () => true)

  return <>
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
                const showDropdown = !event.acknowledged

                return <tr
                  key={event.eid}
                  className={cx('border-bottom border-f-gray13', {
                    'is-new': !event.acknowledged,
                  })}
                >
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
                  <td className="py-4 mr-auto">
                    <span dangerouslySetInnerHTML={{ __html: event.desc }} />
                  </td>
                  <td>
                    {
                      showDropdown && <UncontrolledDropdown className="text-right">
                        <DropdownToggle tag="button" className="btn IconButton">
                          <FontAwesomeIcon icon={faEllipsisH} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => handleAcknowledgeEvent(event)}>Acknowledge</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    }
                  </td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    }
  </>
}

SiteEvents.propTypes = {
  siteDetail: ImmutablePropTypes.record.isRequired,
  eventList: ImmutablePropTypes.record.isRequired,
  acknowledgeEventState: PropTypes.string.isRequired,
  loadSiteEventList: PropTypes.func.isRequired,
  acknowledgeEvent: PropTypes.func.isRequired,
  acknowledgeAllSiteEvents: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  eventList: selectSiteEventList,
  acknowledgeEventState: selectAcknowledgeEventState,
})

const actions = {
  loadSiteEventList,
  acknowledgeEvent,
  acknowledgeAllSiteEvents,
}

export default compose(
  connect(selector, actions),
)(SiteEvents)
