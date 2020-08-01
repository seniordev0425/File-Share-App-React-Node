import React, { useMemo, useState } from 'react'
import { List } from 'immutable'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col, Button,
  Nav, NavItem, NavLink,
  ListGroup, ListGroupItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExchangeAlt, faChartBar, faSortAmountUp, faDownload,
} from '@fortawesome/free-solid-svg-icons'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { formatCurrency } from 'utils/currency'
import { groupStats } from 'utils/data'
import { selectSiteDetail } from 'store/modules/sites'
import {
  selectSiteStatsMap,
  selectRecentSiteStatsMap,
  loadSiteStats,
  loadRecentSiteStats,
} from 'store/modules/siteStats'
import {
  selectPlan,
  selectSubscription,
  loadPlan,
  loadSubscription,
} from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import StatsChart from 'components/common/StatsChart'
import UsageDateRangePicker from 'components/common/UsageDateRangePicker'
import EventListItem from './eventListItem'


export function SiteUsage(props) {
  const {
    siteDetail,
    siteStatsMap, loadSiteStats, recentSiteStatsMap, loadRecentSiteStats,
    plan, loadPlan, subscription, loadSubscription,
  } = props
  const [graphPeriod, setGraphPeriod] = useState(168)
  const [showTransfers, setShowTransfers] = useState(true)
  const [dates, setDates] = useState(null)
  const server = siteDetail.data.server
  const siteStats = siteStatsMap.get(server)
  const recentSiteStats = recentSiteStatsMap.get(server)

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

  useDataLoadEffect(plan, loadPlan)

  useDataLoadEffect(subscription, loadSubscription)

  const totalTransfers = useMemo(() => {
    return siteStats && siteStats.data ?
      siteStats.data.transfers.reduce((value, statsData) => parseInt(value) + parseInt(statsData.transfers), 0) : 0
  }, [siteStats])

  const totalBytes = useMemo(() => {
    return siteStats && siteStats.data ?
      siteStats.data.transfers.reduce((value, statsData) => parseInt(value) + parseInt(statsData.bytes), 0) : 0
  }, [siteStats])

  const totalCosts = plan.data ? totalBytes / plan.data.unit * plan.data.price_meter : 0

  const logsLoaded = (
    siteStats &&
    hasSucceeded(siteStats.state) &&
    hasSucceeded(plan.state) &&
    hasSucceeded(subscription.state)
  )
  const isPremium = plan.data && plan.data.name !== 'FreeTier'

  const groupedStats = useMemo(
    () => List(groupStats(siteStats && siteStats.data && siteStats.data.transfers)),
    [siteStats]
  )

  const groupedRecentStats = useMemo(
    () => List(groupStats(recentSiteStats && recentSiteStats.data && recentSiteStats.data.transfers, false)),
    [recentSiteStats]
  )

  return <div>
    <Row noGutters className="Usage-graphRow">
      <Col lg="8" className={"d-flex p-3 Overview-graphColumn " + (showTransfers ? 'show-transfers' : 'show-bytes')}>
        <div className="d-flex flex-column p-4 w-100 DetailBlock">
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

            <Nav pills className="mb-4 Graph-timeframeTabs text-f-sm ">
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

      <Col lg="4" className="p-3 Usage-totalsColumn">
        <div className="py-4 h-100 DetailBlock Usage-totals">
          <h2 className="h6 pb-4 px-4 mb-3 border-bottom DetailBlock-heading border-f-gray15">
            Totals
          </h2>
          {
            hasSucceeded(plan.state) ?
            <Row noGutters className="px-4 flex-lg-column flex-md-row flex-column">
              <Col md className="d-flex flex-lg-row flex-md-column align-items-center p-0">
                <div className="m-3 TotalsGraphic-transfers"></div>
                <div className="mx-3 text-lg-left text-md-center">
                  <h3 className="mb-1">Transfers</h3>
                  <span>{totalTransfers.toLocaleString()}</span>
                </div>
              </Col>
              <Col md className="d-flex flex-lg-row flex-md-column align-items-center p-0">
                <div className="m-3 TotalsGraphic-bytes"></div>
                <div className="mx-3 text-lg-left text-md-center">
                  <h3 className="mb-1">Bytes</h3>
                  <span>{totalBytes.toLocaleString()} B</span>
                </div>
              </Col>
              <Col md className="d-flex flex-lg-row flex-md-column align-items-center p-0">
                <div className="m-3 TotalsGraphic-costs"></div>
                <div className="mx-3 text-lg-left text-md-center">
                  <h3 className="mb-1">Costs</h3>
                  <span>
                    {
                      hasSucceeded(subscription.state) ?
                      formatCurrency(subscription.data.currency, totalCosts, 3) :
                      formatCurrency('usd', 0, 3)
                    }
                  </span>
                </div>
              </Col>
            </Row>
            :
            <Spinner />
          }
        </div>
      </Col>
    </Row>

    {
      isPremium &&
      <Row>
        <Col xs="12" className="py-3">
          <div className="p-4 DetailBlock DataList">
            <div className="d-flex flex-wrap align-items-start border-bottom pb-2 px-4 DetailBlock-heading border-f-gray15">
              <h2 className="h6 mb-3 pr-3 mr-auto">
                Usage Log
              </h2>
              <Button tag="a" href="#" color="link" className="p-0 mb-3 text-f-sm">
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Logs
                <span className="rounded-pill px-2 py-1 ml-2 text-uppercase bg-f-gray3 text-f-gray8" style={{ fontSize: '50%' }}>
                  Premium
                </span>
              </Button>
            </div>
            <div className="overflow-auto">
              <div style={{ minWidth: '40rem' }}>
                <Row className="align-items-center border-bottom py-2 mx-3 border-f-gray13">
                  <Col xs="6" className="FilterMenu is-active">
                    <Button color="link" className="px-0">
                      Timeframe
                      <FontAwesomeIcon icon={faSortAmountUp} className="ml-2" />
                    </Button>
                  </Col>
                  <Col xs="2" className="text-right FilterMenu">
                    <Button color="link" className="px-0">
                      Transfers
                      <FontAwesomeIcon icon={faSortAmountUp} className="ml-2 mr-n4" />
                    </Button>
                  </Col>
                  <Col xs="2" className="text-right FilterMenu">
                    <Button color="link" className="px-0">
                      Bytes
                      <FontAwesomeIcon icon={faSortAmountUp} className="ml-2 mr-n4" />
                    </Button>
                  </Col>
                  <Col xs="2" className="text-right FilterMenu">
                    <Button color="link" className="px-0">
                      Costs
                      <FontAwesomeIcon icon={faSortAmountUp} className="ml-2 mr-n4" />
                    </Button>
                  </Col>
                </Row>

                <ListGroup flush className="mx-3">
                  {
                    !logsLoaded && <ListGroupItem className="p-3">
                      <Spinner />
                    </ListGroupItem>
                  }

                  {
                    logsLoaded && siteStats.data.transfers.map(statsData => <EventListItem
                      key={`${statsData.start}_${statsData.end}`}
                      plan={plan.data}
                      subscription={subscription.data}
                      statsData={statsData}
                    />)
                  }
                </ListGroup>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    }
  </div>
}

SiteUsage.propTypes = {
  siteDetail: ImmutablePropTypes.record.isRequired,
  siteStatsMap: ImmutablePropTypes.map.isRequired,
  recentSiteStatsMap: ImmutablePropTypes.map.isRequired,
  plan: ImmutablePropTypes.record.isRequired,
  subscription: ImmutablePropTypes.record.isRequired,
  loadSiteStats: PropTypes.func.isRequired,
  loadRecentSiteStats: PropTypes.func.isRequired,
  loadPlan: PropTypes.func.isRequired,
  loadSubscription: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  siteStatsMap: selectSiteStatsMap,
  recentSiteStatsMap: selectRecentSiteStatsMap,
  plan: selectPlan,
  subscription: selectSubscription,
})

const actions = {
  loadSiteStats,
  loadRecentSiteStats,
  loadPlan,
  loadSubscription,
}

export default compose(
  connect(selector, actions),
)(SiteUsage)
