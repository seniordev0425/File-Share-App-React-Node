import _get from 'lodash/get'
import { ERROR_MAP } from 'constants/errors'
import { logout } from 'store/modules/auth'


const authMiddleware = store => next => action => {
  const actionType = _get(action, 'type')
  if (actionType && actionType.substr(actionType.length - 5) === '/fail') {
    const errorCode = _get(action, 'payload.response.data.error.code')
    if (errorCode === ERROR_MAP.CREDENTIALS_NOT_SUPPLIED) {
      store.dispatch(logout())
    }
  }
  return next(action)
}

export default authMiddleware
