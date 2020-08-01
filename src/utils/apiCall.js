import axios from 'axios'
import { call, put, delay, cancelled } from 'redux-saga/effects'
import _get from 'lodash/get'
import qs from 'qs'

import { API_BASE_URL_VERSIONED } from 'constants/env'
import { reportError } from 'utils/analytics'


const httpMethodsWithData = ['post', 'put', 'patch']

export const addContentTypeHeader = config => ({
  ...config,
  headers: {
    ...(config && config.headers),
    'content-type': 'application/x-www-form-urlencoded',
  },
})

export const apiCall = (method, route, data, config) => {
  method = method.toLowerCase()

  return method === 'get' ?
    axios[method](
      `${API_BASE_URL_VERSIONED}${route}`,
      {
        params: data || {},
      }
    )
    :
    axios[method](
      `${API_BASE_URL_VERSIONED}${route}`,
      qs.stringify(data || {}),
      addContentTypeHeader(config),
    )
}

export function checkAndPut(response, successAction, meta, additionalPayload = {}) {
  if (_get(response, 'data.result')) {
    meta && meta.form && meta.form.callback && meta.form.callback()
    return put(successAction({
      ...additionalPayload,
      ...response.data,
      meta,
    }))
  } else {
    const errorMessage = _get(response, 'data.error.text')
    const error = new Error(errorMessage)
    error.response = response
    Object.keys(additionalPayload).forEach(key => {
      error[key] = additionalPayload[key]
    })
    throw error
  }
}

export function handleFormErrorsAndPut(error, actionCreator, meta, additionalPayload = {}) {
  let errorMeta = meta
  if (meta.form) {
    const { callback, errorHandler } = meta.form
    let errorMessage
    if (errorHandler) {
      errorMessage = errorHandler(error)
      errorMeta = {
        hideNotifications: Boolean(errorMessage)
      }
    }
    if (callback) {
      typeof errorMessage === 'object'
      ? callback(errorMessage)
      : callback()
    }
  }

  return put(actionCreator({
    ...additionalPayload,
    error,
    meta: errorMeta,
  }))
}

export const apiCallSaga = apiCallConfig => function* (action) {
  // Do not make request when offline
  if (!navigator.onLine) {
    return
  }

  const {
    method, route, data, config, noRetry,
    twoFactorTokenGenerator, checkFormErrors,
    successAction, failAction, resetAction,
    beforeSuccessAction, afterSuccessAction,
    beforeFailAction, afterFailAction,
  } = apiCallConfig
  let { idField } = apiCallConfig

  const cancelSource = axios.CancelToken.source()
  const axiosMethod = method.toLowerCase()
  const meta = _get(action, 'payload.meta', {})
  idField = idField || 'id'

  const id = _get(action, ['payload', idField])

  try {
    let response

    let params = config && config.params
    if (twoFactorTokenGenerator) {
      params = yield twoFactorTokenGenerator(params)
    }

    const updatedConfig = {
      ...config,
      params,
    }

    if (axiosMethod === 'get' && !noRetry) {
      const waitTimes = [300, 600, 1200]
      for (let i = 0; i <= waitTimes.length; i += 1) {
        try {
          response = yield call(
            axios[axiosMethod],
            API_BASE_URL_VERSIONED + route,
            {
              ...updatedConfig,
              cancelToken: cancelSource.token,
            }
          )
          break
        } catch(error) {
          if (error.response && error.response.status >= 400 && error.response.status < 500) {
            throw error
          }
          if (i >= waitTimes.length) {
            throw error
          }
        }
        yield delay(waitTimes[i])
      }
    } else if (httpMethodsWithData.indexOf(axiosMethod) === -1) {
      response = yield call(
        axios[axiosMethod],
        API_BASE_URL_VERSIONED + route,
        {
          ...updatedConfig,
          cancelToken: cancelSource.token,
        }
      )
    } else {
      response = yield call(
        axios[axiosMethod],
        API_BASE_URL_VERSIONED + route,
        qs.stringify(data),
        {
          ...addContentTypeHeader(updatedConfig),
          cancelToken: cancelSource.token,
        }
      )
    }

    if (beforeSuccessAction) {
      yield beforeSuccessAction(response)
    }

    if (response.data && response.data.result) {
      yield checkAndPut(response, successAction, meta, id ? {
        [idField]: id,
      } : {})
      if (afterSuccessAction) {
        yield afterSuccessAction(response)
      }
    } else {
      const error = new Error('Failed')
      error.response = response
      if (id) {
        error[idField] = id
      }
      throw error
    }
  } catch (error) {
    if (error.code === '2FA_CANCELED') {
      // If it's 2fa cancelation, just reset and end
      if (resetAction) {
        yield put(resetAction())
      }
    }
    else {
      // Else, regard it as a failure
      if (id) {
        error[idField] = id
      }
      if (beforeFailAction) {
        yield beforeFailAction(error)
      }
      if (checkFormErrors) {
        yield handleFormErrorsAndPut(error, failAction, meta, id ? {
          [idField]: id,
        } : {})
      } else {
        yield put(failAction(error))
      }
      if (afterFailAction) {
        yield afterFailAction(error)
      }
    }

    // Report error to analytics
    reportError(error)

  } finally {
    // Cancel axios request if this saga work has been cancelled
    if (yield cancelled()) {
      yield call(cancelSource.cancel)
    }
  }
}

export const bindCallbackToPromise = () => {
  let _resolve;
  const promise = () => {
    return new Promise(resolve => {
      _resolve = resolve;
    })
  }
  const cb = args => _resolve(args)

  return {
    promise,
    cb
  };
};
