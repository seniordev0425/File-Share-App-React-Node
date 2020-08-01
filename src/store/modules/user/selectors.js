import { hasSucceeded } from 'utils/state'
import { getUsernameInitials } from 'utils/format'

export const selectUser = state => state.getIn(['user', 'user'])

export const selectUserTitle = state => {
  const user = state.getIn(['user', 'user'])
  if (!hasSucceeded(user.state)) {
    return ''
  }
  return getUsernameInitials(user.data)
}

export const selectTwoFactorEnabled = state => state.getIn(['user', 'user', 'data', '2factor']) || false

export const selectUpdateUserState = state => state.getIn(['user', 'updateUserState'])

export const selectUpdateUserLastError = state => state.getIn(['user', 'updateUserLastError'])

export const selectPasswordCodeData = state => state.getIn(['user', 'passwordCodeData'])

export const selectSetPasswordState = state => state.getIn(['user', 'setPasswordState'])

export const selectResetPasswordState = state => state.getIn(['user', 'resetPasswordState'])

export const selectCloseAccountState = state => state.getIn(['user', 'closeAccountState'])
