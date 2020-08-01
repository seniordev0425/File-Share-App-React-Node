export const APP_VERSION = process.env.REACT_APP_VERSION.replace('-', '')

export const API_BASE_URL_VERSIONED = `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_API_VERSION}`

export const STRIPE_JS_URL = process.env.REACT_APP_STRIPE_JS_URL

export const IS_DEBUG_MODE = process.env.REACT_APP_DEBUG === '1'

export const NOTIFICATION_ACKNOWLEDGE_TIMEOUT = process.env.REACT_APP_NOTIFICATION_ACKNOWLEDGE_TIMEOUT

export const SEGMENT_WRITE_KEY = process.env.REACT_APP_SEGMENT_WRITE_KEY

export const BUGSNAG_KEY = process.env.REACT_APP_BUGSNAG_KEY
