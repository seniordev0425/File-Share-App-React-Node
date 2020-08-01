import React from 'react'
import { Route, Switch } from 'react-router-dom'

import lazyLoad from 'hoc/lazyLoad'
import AppLayout from 'components/layouts/AppLayout'
import NotFound from 'components/common/NotFound'
import FullSiteResyncConfirmModal from 'components/common/FullSiteResyncConfirmModal'
import Dashboard from 'components/sites/Dashboard'
import Site from 'components/sites/Site'
import ManualSyncModal from 'components/sites/ManualSyncModal'


/* Split out site create and settings page because users may not be accessing these pages frequently */
const LazyLoadedSiteCreate = lazyLoad(() => import(/* webpackChunkName: 'siteCreate' */ 'components/sites/SiteCreate'))
const LazyLoadedSiteSettings = lazyLoad(() => import(/* webpackChunkName: 'siteSettings' */ 'components/sites/SiteSettings'))

const Routes = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/sites" component={Dashboard} />
      <Route exact path="/sites/create" component={LazyLoadedSiteCreate} />
      <Route exact path="/sites/:server/settings" component={LazyLoadedSiteSettings} />
      <Route path="/sites/:server" component={Site} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>

    <ManualSyncModal />
    <FullSiteResyncConfirmModal />
  </AppLayout>
)

export default Routes
