import React from 'react'
import { Route, Switch } from 'react-router-dom'

/* Common helpers and components */
import GlobalErrorBoundary from 'components/common/GlobalErrorBoundary'
import PersistGate from 'components/common/PersistGate'
import ScrollToTop from 'components/common/ScrollToTop'
import PollingMonitor from 'components/common/PollingMonitor'
import TwoFactorInputModal from 'components/common/TwoFactorInputModal'
import NotificationMonitor from 'components/common/NotificationMonitor'
import VersionChecker from 'components/common/VersionChecker'
import ErrorReportPage from 'components/common/ErrorReportPage'
import ErrorReportDone from 'components/common/ErrorReportDone'
import lazyLoad from 'hoc/lazyLoad'
import { userIsAuthenticated } from 'hoc/authWrappers'


/* Code-split routes */
const HomeRoutes = lazyLoad(() => import(/* webpackChunkName: 'home' */ './home'))
const AccountRoutes = userIsAuthenticated(
  lazyLoad(() => import(/* webpackChunkName: 'account' */ './account'))
)
const SitesRoutes = userIsAuthenticated(
  lazyLoad(() => import(/* webpackChunkName: 'sites' */ './sites'))
)
const AnalyticsRoutes = userIsAuthenticated(
  lazyLoad(() => import(/* webpackChunkName: 'analytics' */ './analytics'))
)
const TwoFactorRoutes = userIsAuthenticated(
  lazyLoad(() => import(/* webpackChunkName: 'twofactor' */ './twofactor'))
)
const StorageRoutes = lazyLoad(() => import(/* webpackChunkName: 'storage' */ './storage'))

const NotFound = lazyLoad(() => import(/* webpackChunkName: 'notFound' */ '../components/common/NotFound'))
const SegmentAnalytics = lazyLoad(() => import(/* webpackChunkName: 'segment' */ '../components/common/SegmentAnalytics'))

const Routes = () => <div>
  <GlobalErrorBoundary>
    <PersistGate>
      <ScrollToTop>
        <Switch>
          {/* sub-app routes which are loaded dynamically as chunks */}
          <Route path="/account" component={AccountRoutes} />
          <Route path="/sites" component={SitesRoutes} />
          <Route path="/analytics" component={AnalyticsRoutes} />
          <Route path="/twofactor" component={TwoFactorRoutes} />
          <Route path="/storage" component={StorageRoutes} />

          <Route exact path="/report-error" component={ErrorReportPage} />
          <Route exact path="/report-error/done" component={ErrorReportDone} />

          {/* Place index route components at last because its url range is the widest */}
          {/*
          TODO: react-router-dom 4.3.1 complains about HomeRoutes not func although it's valid component. Update
          react-router-dom when 4.4.0 is released.
          */}
          <Route path="/" component={HomeRoutes} />
          <Route path="/404" component={NotFound} />
        </Switch>
      </ScrollToTop>

      <PollingMonitor />
      <NotificationMonitor />
      <TwoFactorInputModal />
      <VersionChecker />
    </PersistGate>
  </GlobalErrorBoundary>

  <SegmentAnalytics />
</div>

export default Routes
