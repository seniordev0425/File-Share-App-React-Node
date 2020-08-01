import React from 'react'
import { Route, Switch } from 'react-router-dom'

import AppLayout from 'components/layouts/AppLayout'
import NotFound from 'components/common/NotFound'
import AccountSettings from 'components/account/AccountSettings'


const Routes = () => (
  <AppLayout>
    <Switch>
      <Route path="/account" component={AccountSettings} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>
  </AppLayout>
)

export default Routes
