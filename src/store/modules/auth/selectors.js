const hasLoggedIn = state => {
  const token = state.getIn(['auth', 'token'])
  if (!token) {
    return false
  }

  const expiresAt = state.getIn(['auth', 'expiresAt'])
  if (expiresAt && expiresAt < new Date()) {
    return false
  }

  return true
}

const hasPassed2fa = state => !!state.getIn(['auth', 'passed2fa'])

export const selectLoginState = state => state.getIn(['auth', 'loginState'])

export const selectAuthToken = state => state.getIn(['auth', 'token'])

export const selectIsLoggedIn = state => hasLoggedIn(state)

export const selectHasPassed2fa = state => hasPassed2fa(state)

export const selectIsAuthenticated = state => hasLoggedIn(state) && hasPassed2fa(state)

export const selectAPIKeyList = state => state.getIn(['auth', 'apiKeyList'])

export const selectCreateKeyState = state => state.getIn(['auth', 'createKeyState'])

export const selectDeleteKeyState = state => state.getIn(['auth', 'deleteKeyState'])
