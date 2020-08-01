import React from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col, Button,
  TabContent, TabPane, Nav, NavItem, NavLink,
} from 'reactstrap'
import { Route, Link } from 'react-router-dom'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThLarge, faFolder, faChartArea, faGlobe, faBell, faChartBar, faAngleLeft,
} from '@fortawesome/free-solid-svg-icons'

import { hasFailed, hasSucceeded, isPending, isNotFoundStatus } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import NotFound from 'components/common/NotFound'
import Spinner from 'components/common/Spinner'
import {
  selectSiteDetail,
  selectSitePreviewMap,
  loadSiteDetail,
  loadSitePreview,
  updateSiteDetail,
} from 'store/modules/sites'
import {
  selectStorageDetail,
  loadStorageDetail,
} from 'store/modules/storage'
import SiteOverview from '../SiteOverview'
import SiteBrowse from '../SiteBrowse'
import SiteAnalytics from '../SiteAnalytics'
import SiteDomain from '../SiteDomain'
import SiteEvents from '../SiteEvents'
import SiteUsage from '../SiteUsage'
import SiteTitle from './SiteTitle'
import FlaggedAlert from './FlaggedAlert'


export function Site(props) {
  const {
    match, location,
    siteDetail, loadSiteDetail, updateSiteDetail,
    sitePreviewMap, loadSitePreview,
    storageDetail, loadStorageDetail,
  } = props
  const server = match.params.server
  const sitePreview = sitePreviewMap.get(server)
  const storage = siteDetail.data && siteDetail.data.storage

  useDataLoadEffect(
    siteDetail,
    loadSiteDetail,
    () => ({
      server,
    }),
    needsLoading => needsLoading || (
      siteDetail.data &&
      siteDetail.data.server !== server
    ),
    [server]
  )

  useDataLoadEffect(
    storageDetail,
    loadStorageDetail,
    () => ({
      storage,
    }),
    needsLoading => needsLoading && storage,
    [siteDetail]
  )

  useDataLoadEffect(
    sitePreview,
    loadSitePreview,
    () => ({
      server,
    }),
    needsLoading => (
      needsLoading &&
      siteDetail.data &&
      siteDetail.data.server === server &&
      siteDetail.data.enabled
    ),
    [siteDetail]
  )

  const currentSubroute = location.pathname.replace(`/sites/${server}`, '').replace(/^\//, '')
  const activeTab = currentSubroute.substr(0, 6) === 'browse' ? 'browse' : currentSubroute

  const previewUrl = sitePreview && hasSucceeded(sitePreview.state) ? sitePreview.data.url : ''

  return <>
    <Button outline color="primary" className="border-0 mt-3 ml-3 BackButton text-f-md" tag={Link} to="/">
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Home
    </Button>

    {
      isPending(siteDetail.state) && <Spinner />
    }

    {
      hasFailed(siteDetail.state) && (
        isNotFoundStatus(siteDetail.statusCode)
        ? <NotFound />
        : <Spinner />
      )
    }

    {
      hasSucceeded(siteDetail.state) && <>
        <SiteTitle
          site={siteDetail.data}
          previewUrl={previewUrl}
          updateSiteDetail={updateSiteDetail}
        />

        {
          siteDetail.data.locked && <FlaggedAlert />
        }

        <section className="px-5 pt-4 pb-4">
          <Row>
            <Col lg="12">
              <Nav pills className="Tabs text-f-md">
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute === '' })}
                    to={`/sites/${server}`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faThLarge} className="mr-2" />Overview
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute.substr(0, 6) === 'browse' })}
                    to={`/sites/${server}/browse`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faFolder} className="mr-2" />Browse Files
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute === 'analytics' })}
                    to={`/sites/${server}/analytics`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faChartArea} className="mr-2" />Analytics
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute === 'domain' })}
                    to={`/sites/${server}/domain`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-2" />Domain
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute === 'events' })}
                    to={`/sites/${server}/events`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faBell} className="mr-2" />Events
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={cx('px-4', { active: currentSubroute === 'usage' })}
                    to={`/sites/${server}/usage`}
                    tag={Link}
                  >
                    <FontAwesomeIcon icon={faChartBar} className="mr-2" />Usage
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </section>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="" className="pt-3 pb-5 px-sm-3 px-0 bg-f-gray15">
            <Route exact path={`/sites/:server`} component={SiteOverview} />
          </TabPane>
          <TabPane tabId="browse" className="pt-3 pb-5 px-5">
            <Route path={`/sites/:server/browse`} component={SiteBrowse} />
          </TabPane>
          <TabPane tabId="analytics" className="pt-3 pb-5 px-5 text-f-md">
            <Route exact path={`/sites/:server/analytics`} component={SiteAnalytics} />
          </TabPane>
          <TabPane tabId="domain" className="pt-3 pb-5 px-4">
            <Route exact path={`/sites/:server/domain`} component={SiteDomain} />
          </TabPane>
          <TabPane tabId="events" className="pt-3 pb-5 px-4">
            <Route exact path={`/sites/:server/events`} component={SiteEvents} />
          </TabPane>
          <TabPane tabId="usage" className="pt-3 pb-5 px-sm-3 px-0 bg-f-gray15">
            <Route exact path={`/sites/:server/usage`} component={SiteUsage} />
          </TabPane>
        </TabContent>
      </>
    }
  </>
}

Site.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  siteDetail: ImmutablePropTypes.record.isRequired,
  sitePreviewMap: ImmutablePropTypes.map.isRequired,
  storageDetail: ImmutablePropTypes.record.isRequired,
  loadSiteDetail: PropTypes.func.isRequired,
  loadSitePreview: PropTypes.func.isRequired,
  loadStorageDetail: PropTypes.func.isRequired,
  updateSiteDetail: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  sitePreviewMap: selectSitePreviewMap,
  storageDetail: selectStorageDetail,
})

const actions = {
  loadSiteDetail,
  loadSitePreview,
  loadStorageDetail,
  updateSiteDetail,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(Site)
