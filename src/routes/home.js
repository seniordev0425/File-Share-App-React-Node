import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { compose } from 'redux'

import {
  userIsLoggedIn,
  userIsNotLoggedIn,
  userIsNotLoggedInWhenGettingStarted,
  userHasNotPassed2fa,
} from 'hoc/authWrappers'
import NotFound from 'components/common/NotFound'
import FunnelLayout from 'components/layouts/FunnelLayout'
import Login from 'components/home/Login'
import LoginFromSignup from 'components/home/LoginFromSignup'
import Signup from 'components/home/Signup'
import TwoFactorLogin from 'components/home/TwoFactorLogin'
import TwoFactorLoginByAuthy from 'components/home/TwoFactorLoginByAuthy'
import TwoFactorLoginByPhone from 'components/home/TwoFactorLoginByPhone'
import TwoFactorVerifyCode from 'components/home/TwoFactorVerifyCode'
import SetPassword from 'components/home/SetPassword'
import ResetPassword from 'components/home/ResetPassword'
import ResetPasswordByCode from 'components/home/ResetPasswordByCode'
import ResetPasswordSuccess from 'components/home/ResetPasswordSuccess'


const WrappedLogin = userIsNotLoggedIn(Login)
const WrappedLoginFromSignup = userIsNotLoggedIn(LoginFromSignup)
const WrappedSignup = userIsNotLoggedIn(Signup)
const WrappedSetPassword = userIsNotLoggedInWhenGettingStarted(SetPassword)
const WrappedTwoFactorLogin = compose(
  userIsLoggedIn,
  userHasNotPassed2fa,
)(TwoFactorLogin)
const WrappedTwoFactorLoginByAuthy = compose(
  userIsLoggedIn,
  userHasNotPassed2fa,
)(TwoFactorLoginByAuthy)
const WrappedTwoFactorLoginByPhone = compose(
  userIsLoggedIn,
  userHasNotPassed2fa,
)(TwoFactorLoginByPhone)
const WrappedTwoFactorVerifyCode = compose(
  userIsLoggedIn,
  userHasNotPassed2fa,
)(TwoFactorVerifyCode)
const WrappedResetPassword = userIsNotLoggedIn(ResetPassword)
const WrappedResetPasswordByCode = userIsNotLoggedIn(ResetPasswordByCode)
const WrappedResetPasswordSuccess = userIsNotLoggedIn(ResetPasswordSuccess)

const Routes = () => (
  <FunnelLayout>
    <Switch>
      <Redirect exact from="/" to="/sites" />
      <Route exact path="/login" component={WrappedLogin} />
      <Route exact path="/login/welcome-back" component={WrappedLoginFromSignup} />
      <Route exact path="/signup" component={WrappedSignup} />
      <Route exact path="/signup/setpassword" component={WrappedSetPassword} />
      <Route exact path="/login/twofactor" component={WrappedTwoFactorLogin} />
      <Route exact path="/login/twofactor/authy" component={WrappedTwoFactorLoginByAuthy} />
      <Route exact path="/login/twofactor/phone/:method" component={WrappedTwoFactorLoginByPhone} />
      <Route exact path="/login/twofactor/code/:code" component={WrappedTwoFactorVerifyCode} />
      <Route exact path="/password/reset" component={WrappedResetPassword} />
      <Route exact path="/password" component={WrappedResetPasswordByCode} />
      <Route exact path="/password/reset/success" component={WrappedResetPasswordSuccess} />

      {/* Show Not Found page when url does not match */}
      <Route component={NotFound} />
    </Switch>
  </FunnelLayout>
)

export default Routes
