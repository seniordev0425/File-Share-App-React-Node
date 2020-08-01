import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import {
  selectIsAuthenticated,
  selectIsLoggedIn,
  selectHasPassed2fa,
} from 'store/modules/auth'


export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: state => selectIsLoggedIn(state) ? '/login/twofactor' : '/login',
  authenticatedSelector: selectIsAuthenticated,
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsLoggedIn = connectedRouterRedirect({
  redirectPath: '/login',
  allowRedirectBack: false,
  authenticatedSelector: selectIsLoggedIn,
  wrapperDisplayName: 'userIsLoggedIn'
})

export const userIsNotLoggedIn = connectedRouterRedirect({
  redirectPath: state => selectHasPassed2fa(state) ? '/' : '/login/twofactor',
  allowRedirectBack: false,
  authenticatedSelector: state => !selectIsLoggedIn(state),
  wrapperDisplayName: 'userIsNotLoggedIn'
})

export const userIsNotLoggedInWhenGettingStarted = connectedRouterRedirect({
  redirectPath: '/sites?welcome=1',
  allowRedirectBack: false,
  authenticatedSelector: state => !selectIsLoggedIn(state),
  wrapperDisplayName: 'userIsNotLoggedInWhenGettingStarted'
})

export const userHasNotPassed2fa = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => !selectHasPassed2fa(state),
  wrapperDisplayName: 'userHasNotPassed2fa'
})

export const RenderOnlyForAuthenticated = connectedAuthWrapper({
  authenticatedSelector: selectIsAuthenticated,
  wrapperDisplayName: 'RenderOnlyForAuthenticated',
})
