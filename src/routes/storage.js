import React from 'react'
import { Route, Switch } from 'react-router-dom'

import NotFound from 'components/common/NotFound'
import FunnelLayout from 'components/layouts/FunnelLayout'
import StorageContinue from 'components/storage/StorageContinue'
import StorageLink from 'components/storage/StorageLink'


const Routes = () => (
  <FunnelLayout>
    <Switch>
      <Route exact path="/storage/continue/:storage" component={StorageContinue} />
      <Route exact path="/storage/link/:storage" component={StorageLink} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>
  </FunnelLayout>
)

export default Routes
