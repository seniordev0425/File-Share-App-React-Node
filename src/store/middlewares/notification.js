import get from 'lodash/get'

import { isActionFail, isActionSuccess } from 'utils/state'
import { push } from 'store/modules/notifications'
import { getResponseErrorMessage } from 'utils/errorMessage'

const notificationMiddleware = store => next => action => {
  const { type, payload, meta } = action
  if (isActionFail(type) && payload && !(meta && meta.hideNotifications)) {
    const errorResponse = get(payload, 'response') || get(payload, 'error.response')
    if ((meta && meta.failureMessage) || !(get(errorResponse, 'status') === 404 || get(errorResponse, '.status') === 404)) {
      const message = getResponseErrorMessage(errorResponse, meta.failureMessage) || payload.message

      store.dispatch(push({
        type: 'danger',
        message,
        error: get(payload, 'error', (payload instanceof Error ? payload : null)),
      }))
    }
  }

  if (isActionSuccess(type) && meta && meta.successMessage && !meta.hideNotifications) {
    store.dispatch(push({
      type: 'success',
      message: meta.successMessage,
    }))
  }

  return next(action)
}

export default notificationMiddleware
