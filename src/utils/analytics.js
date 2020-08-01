import Bugsnag from '@bugsnag/js'

import { BUGSNAG_KEY } from 'constants/env'


export function trackActivity(event, payload) {
  // Report to segment
  if (window.analytics) {
    window.analytics.track(event, payload)
  }
}

export function reportError(error, additionalData = {}, callback = null) {
  if (BUGSNAG_KEY) {
    const bugsnagClient = Bugsnag(BUGSNAG_KEY)

    const metaData = Object.assign({}, additionalData)
    if (error.response && error.response.headers) {
      const xFstDebug = error.response.headers.get('X-Fst-Debug')
      if (xFstDebug) {
        metaData['X-Fst-Debug'] = xFstDebug
      }
      const cfRay = error.response.headers.get('Cf-ray')
      if (cfRay) {
        metaData['Cf-ray'] = cfRay
      }
    }

    bugsnagClient.notify(error, {
      metaData,
    }, callback || (e => e))
  } else {
    console.error(error)
  }
}
