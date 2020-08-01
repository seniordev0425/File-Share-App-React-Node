import { isActionFail } from 'utils/state'


const logMiddleware = store => next => action => {
  const { type, payload: error } = action
  if (isActionFail(type) && error && error.response ) {
    // Log api error
    if (window.analytics) {
      window.analytics.track('API Error', error.response.data)
    }
  }

  return next(action)
}

export default logMiddleware
