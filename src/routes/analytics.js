import React from 'react'
import { Route, Switch } from 'react-router-dom'

import AppLayout from 'components/layouts/AppLayout'
import NotFound from 'components/common/NotFound'
import AnalyticsProfileCreate from 'components/analytics/AnalyticsProfileCreate'
import AnalyticsProfileDetails from 'components/analytics/AnalyticsProfileDetails'
import AnalyticsProfileDeleted from 'components/analytics/AnalyticsProfileDeleted'
import ChooseProfileForSite from 'components/analytics/ChooseProfileForSite'


const Routes = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/analytics/create" component={AnalyticsProfileCreate} />
      <Route exact path="/analytics/:name" component={AnalyticsProfileDetails} />
      <Route exact path="/analytics/:name/deleted" component={AnalyticsProfileDeleted} />
      <Route exact path="/analytics/choose-profile/site/:server" component={ChooseProfileForSite} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>
  </AppLayout>
)

export default Routes
