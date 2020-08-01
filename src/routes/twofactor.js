import React from 'react'
import { Route, Switch } from 'react-router-dom'

import AppLayout from 'components/layouts/AppLayout'
import NotFound from 'components/common/NotFound'
import TwoFactorLayout from 'components/twofactor/TwoFactorLayout'
import TwoFactorAddPhone from 'components/twofactor/TwoFactorAddPhone'
import TwoFactorEnable from 'components/twofactor/TwoFactorEnable'
import TwoFactorSendCode from 'components/twofactor/TwoFactorSendCode'
import TwoFactorVerifyAuthy from 'components/twofactor/TwoFactorVerifyAuthy'
import TwoFactorVerifyCode from 'components/twofactor/TwoFactorVerifyCode'


const wrapWithLayout = WrappedComponent => props => <TwoFactorLayout>
  <WrappedComponent {...props} />
</TwoFactorLayout>

const WrappedTwoFactorAddPhone = wrapWithLayout(TwoFactorAddPhone)
const WrappedTwoFactorEnable = wrapWithLayout(TwoFactorEnable)
const WrappedTwoFactorSendCode = wrapWithLayout(TwoFactorSendCode)
const WrappedTwoFactorVerifyAuthy = wrapWithLayout(TwoFactorVerifyAuthy)
const WrappedTwoFactorVerifyCode = wrapWithLayout(TwoFactorVerifyCode)

const Routes = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/twofactor/addphone" component={WrappedTwoFactorAddPhone} />
      <Route exact path="/twofactor/addphone/:reset" component={WrappedTwoFactorAddPhone} />
      <Route exact path="/twofactor/enable" component={WrappedTwoFactorEnable} />
      <Route exact path="/twofactor/enable/:method" component={WrappedTwoFactorEnable} />
      <Route exact path="/twofactor/sendcode/:method" component={WrappedTwoFactorSendCode} />
      <Route exact path="/twofactor/verifyauthy" component={WrappedTwoFactorVerifyAuthy} />
      <Route exact path="/twofactor/verifycode/:method" component={WrappedTwoFactorVerifyCode} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>
  </AppLayout>
)

export default Routes
