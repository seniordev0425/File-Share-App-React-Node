export const selectTwoFactor = state => state.getIn(['twofactor', 'twoFactor'])

export const selectAddTwoFactorState = state => state.getIn(['twofactor', 'addTwoFactorState'])

export const selectVerifyCodeState = state => state.getIn(['twofactor', 'verifyCodeState'])

export const selectVerifyCodeResult = state => state.getIn(['twofactor', 'verifyCodeResult'])

export const selectTwoFactorAuth = state => state.getIn(['twofactor', 'twoFactorAuth'])

export const selectTwoFactorAuthResult = state => state.getIn(['twofactor', 'twoFactorAuthResult'])

export const selectRemoveTwoFactorState = state => state.getIn(['twofactor', 'removeTwoFactorState'])

export const selectSendCodeState = state => state.getIn(['twofactor', 'sendCodeState'])

export const selectPreference = state => state.getIn(['twofactor', 'preference'])
