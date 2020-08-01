import React, { useState, useMemo } from 'react'
import { List } from 'immutable'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Nav, NavItem, NavLink,
  ListGroup, Button,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExchangeAlt, faChartBar, faSyncAlt,
  faGlobe, faPlus, faToggleOn, faToggleOff, faCog,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { groupStats } from 'utils/data'
import {
  selectSiteDetail,
} from 'store/modules/sites'
import {
  selectRootDetails,
  loadRootDetails,
} from 'store/modules/siteContent'
import {
  selectFlushCacheRequestState,
  precache,
  manualSync,
} from 'store/modules/siteUpdates'
import {
  selectSiteStatsMap,
  selectRecentSiteStatsMap,
  loadSiteStats,
  loadRecentSiteStats,
} from 'store/modules/siteStats'
import {
  selectSiteEventList,
  loadSiteEventList,
  acknowledgeEvent,
} from 'store/modules/events'
import {
  selectStorageList,
  selectStorageDetail,
  loadStorageList,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'
import UsageDateRangePicker from 'components/common/UsageDateRangePicker'
import StatsChart from 'components/common/StatsChart'
import DisabledLink from 'components/common/DisabledLink'
import EventListItem from './eventListItem'


export function SiteOverview(props) {
  const {
    siteDetail, siteStatsMap, loadSiteStats, recentSiteStatsMap, loadRecentSiteStats,
    storageList, loadStorageList, storageDetail,
    rootDetails, loadRootDetails,
    siteEventList, loadSiteEventList, acknowledgeEvent, precache, manualSync,
  } = props
  const [graphPeriod, setGraphPeriod] = useState(168)
  const [showTransfers, setShowTransfers] = useState(true)
  const [dates, setDates] = useState(null)
  const server = siteDetail.data.server
  const siteStats = siteStatsMap.get(server)
  const recentSiteStats = recentSiteStatsMap.get(server)

  useDataLoadEffect(
    siteStats,
    loadSiteStats,
    () => {
      const startDate = new Date()
      startDate.setSeconds(0)
      startDate.setMinutes(0)
      startDate.setMilliseconds(0)
      const endDate = new Date(startDate)
      startDate.setHours(startDate.getHours() - graphPeriod)
      return {
        server,
        start: startDate,
        end: endDate,
      }
    },
    needsLoading => needsLoading && graphPeriod !== 1,
    [graphPeriod]
  )

  useDataLoadEffect(
    recentSiteStats,
    loadRecentSiteStats,
    () => ({
      server,
    })
  )

  useDataLoadEffect(storageList, loadStorageList)

  useDataLoadEffect(
    rootDetails,
    loadRootDetails,
    () => ({
      server,
    })
  )

  useDataLoadEffect(siteEventList, loadSiteEventList, () => ({
    limit: 10,
    server,
  }))

  const handleSelectDates = dates => {
    setDates(dates)
    if (dates.start && dates.end) {
      loadSiteStats({
        server,
        start: dates.start.toDate(),
        end: dates.end.toDate(),
      })
    }
  }

  const handleAcknowledgeEvent = event => acknowledgeEvent({
    eid: event.eid
  })

  const handleManualSync = () => manualSync({
    server,
    path: '',
  })

  const handlePushToCDN = () => precache({
    server,
    path: '/',
  })

  const storage = storageList.data && storageList.data.find(storage => storage.name === siteDetail.data.storage)
  const storageName = storage ? storage.display : '...'

  const featureFlags = {
    indexfiles: 'Use index files',
    fancyindexing: 'Automatic folder listing',
    autoupdate: 'Automatic sync from storage',
    precache: 'Automatic deployment to CDN',
  }

  const groupedStats = useMemo(
    () => List(groupStats(siteStats && siteStats.data && siteStats.data.transfers)),
    [siteStats]
  )

  const groupedRecentStats = useMemo(
    () => List(groupStats(recentSiteStats && recentSiteStats.data && recentSiteStats.data.transfers, false)),
    [recentSiteStats]
  )

  return <div>
    <Row noGutters className="Overview-graphRow">

      <Col xl="8" className="d-flex p-3">
        <div className={"d-flex flex-column p-4 w-100 DetailBlock " + (showTransfers ? 'show-transfers' : 'show-bytes')}>
          <div className="d-flex flex-wrap align-items-start">
            <h2 className="h6 mt-2 mb-4 mr-auto pr-4">
              Usage: {showTransfers ? 'Transfers' : 'Bytes'}
            </h2>

            <UsageDateRangePicker
              onSelectDates={handleSelectDates}
              dates={dates}
            />

            {/* <Button
              color="link"
              className="border-0 mb-4 text-f-sm nav-link"
            >
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              View all
            </Button> */}

            <Nav pills className="mb-4 Graph-timeframeTabs text-f-sm">
              <NavItem>
                <NavLink
                  active={graphPeriod === 720}
                  href="#"
                  onClick={() => setGraphPeriod(720)}
                >
                  30 days
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={graphPeriod === 168}
                  href="#"
                  onClick={() => setGraphPeriod(168)}
                >
                  7 days
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={graphPeriod === 1}
                  href="#"
                  onClick={() => setGraphPeriod(1)}
                >
                  1 hour
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <div className="flex-grow-1 mx-n3 GraphContainer">
            <StatsChart
              listData={graphPeriod > 1 ? groupedStats : groupedRecentStats}
              showTransfers={showTransfers}
              viewInHours={graphPeriod <= 48}
            />
          </div>

          <Nav pills className="mt-4 Graph-dataTabs text-f-sm">
            <NavItem>
              <NavLink active={showTransfers} href="#" onClick={() => setShowTransfers(true)}>
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                Transfers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={!showTransfers} href="#" onClick={() => setShowTransfers(false)}>
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Bytes
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Col>

      <Col xl="4" className="p-3">
        <Row className="h-100">
          <Col xl="12" lg="6" className="pb-xl-3 pb-lg-0 pb-3">
            <div className="py-4 h-100 DetailBlock Overview-basicInfo">
              <div className="px-sm-5 px-4 py-2">
                <div className="px-4 pb-4 mx-sm-n5 mx-n4 mb-4 border-bottom DetailBlock-heading border-f-gray15">
                  <h2 className="px-1 text-f-sm">Quick Actions</h2>
                  <Row noGutters>
                    <Col lg xs="auto" className="p-1">
                      <Button
                        color="primary"
                        className="w-100 h-100 text-f-sm"
                        onClick={handleManualSync}
                        disabled={!storageDetail.data}
                      >
                        Sync from {storageName}
                      </Button>
                    </Col>
                    <Col lg xs="auto" className="p-1">
                      <Button
                        color="primary"
                        className="w-100 h-100 text-f-sm"
                        onClick={handlePushToCDN}
                      >
                        Push to CDN
                      </Button>
                    </Col>
                  </Row>
                </div>

                {
                  storage && <Row className="py-2">
                    <Col tag="span" sm="auto" className="py-2">
                      <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                      Syncs from:
                    </Col>
                    <Col tag="span" className="py-2">
                      {
                        rootDetails.data ?
                        <a
                          href={rootDetails.data.details.origin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {storageName}
                          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" className="ml-1" />
                        </a>
                        :
                        <DisabledLink>
                          {storageName}
                          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" className="ml-1" />
                        </DisabledLink>
                      }
                    </Col>
                  </Row>
                }

                <Row className="py-2">
                  <Col sm="auto" className="py-2">
                    <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                    Domain:
                  </Col>
                  {/* TODO: update this UI when domain support is added */}
                  <Col className="py-2">
                    <a href="/" className="text-nowrap" onClick={e => e.preventDefault()}>
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add a domain
                    </a>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          <Col xl="12" lg="6" className="pt-xl-3 pt-lg-0 pt-3">
            <div className="d-flex flex-column py-4 h-100 DetailBlock Overview-settings">
              <div className="px-sm-5 px-4 pt-2 pb-4">
                {
                  Object.keys(featureFlags).map(flagField => (
                    <Row key={flagField} className="py-2">
                      <Col tag="span" lg="7" className="py-2">{featureFlags[flagField]}</Col>
                      <Col
                        tag="span"
                        className={cx('py-2 text-lg-right text-nowrap', {
                          'is-enabled': siteDetail.data[flagField],
                        })}
                      >
                        <FontAwesomeIcon
                          icon={siteDetail.data[flagField] ? faToggleOn : faToggleOff}
                          size="sm"
                          className="mr-2"
                        />
                        {siteDetail.data[flagField] ? 'Enabled' : 'Disabled'}
                      </Col>
                    </Row>
                  ))
                }
              </div>
              <div className="pt-3 px-5 mt-auto border-top DetailBlock-heading border-f-gray15 text-right">
                <Link to={`/sites/${siteDetail.data.server}/settings`} className="d-inline-block mt-1">
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  Modify settings
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row noGutters>
      <Col xs="12" className="p-3">
        <div className="py-4 DetailBlock DataList">
          <h2 className="h6 pb-4 px-4 mb-0 border-bottom DetailBlock-heading border-f-gray15">
            Recent Events
          </h2>

          {
            !hasSucceeded(siteEventList.state) && <Spinner />
          }

          {
            hasSucceeded(siteEventList.state) && <ListGroup flush className="px-4">
              {
                siteEventList.data.map(event => (
                  <EventListItem
                    key={event.eid}
                    event={event}
                    onAcknowledge={handleAcknowledgeEvent}
                  />
                ))
              }
            </ListGroup>
          }
        </div>
      </Col>
    </Row>
  </div>
}

SiteOverview.propTypes = {
  siteDetail: ImmutablePropTypes.record.isRequired,
  siteStatsMap: ImmutablePropTypes.map.isRequired,
  recentSiteStatsMap: ImmutablePropTypes.map.isRequired,
  storageList: ImmutablePropTypes.record.isRequired,
  storageDetail: ImmutablePropTypes.record.isRequired,
  rootDetails: ImmutablePropTypes.record.isRequired,
  siteEventList: ImmutablePropTypes.record.isRequired,
  flushCacheRequestState: PropTypes.string.isRequired,
  loadSiteStats: PropTypes.func.isRequired,
  loadRecentSiteStats: PropTypes.func.isRequired,
  loadStorageList: PropTypes.func.isRequired,
  loadRootDetails: PropTypes.func.isRequired,
  loadSiteEventList: PropTypes.func.isRequired,
  acknowledgeEvent: PropTypes.func.isRequired,
  precache: PropTypes.func.isRequired,
  manualSync: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  siteStatsMap: selectSiteStatsMap,
  recentSiteStatsMap: selectRecentSiteStatsMap,
  storageList: selectStorageList,
  rootDetails: selectRootDetails,
  storageDetail: selectStorageDetail,
  siteEventList: selectSiteEventList,
  flushCacheRequestState: selectFlushCacheRequestState,
})

const actions = {
  loadSiteStats,
  loadRecentSiteStats,
  loadStorageList,
  loadRootDetails,
  loadSiteEventList,
  acknowledgeEvent,
  precache,
  manualSync,
}

export default compose(
  connect(selector, actions),
)(SiteOverview)
