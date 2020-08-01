import { List, fromJS } from 'immutable'
import { createAction } from 'redux-actions'
import _identity from 'lodash/identity'
import _get from 'lodash/get'

import { REQUEST_STATUS, EXPIRATION_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'


export const requestSuccess = (actionType) => `${actionType}/success`

export const requestFail = (actionType) => `${actionType}/fail`

export const requestResetState = (actionType) => `${actionType}/reset`

export const setPageAction = (actionType) => `${actionType}/set_page`

export const setPageSizeAction = (actionType) => `${actionType}/set_page_size`

export const isActionSuccess = (actionType) => actionType.substr(-8) === '/success'

export const isActionFail = (actionType) => actionType.substr(-5) === '/fail'

export const isActionReset = (actionType) => actionType.substr(-6) === '/reset'

const mergeMeta = (metaOptions) => (payload) => ({
  ...metaOptions,
  ...(payload ? payload.meta : {})
})

export const defineLoopActions = (actionType, metaOptions = null) => ({
  start: createAction(
    actionType,
    ({
      skipPendingState,
      ...originalPayload
    } = {}) => originalPayload,
    payload => ({
      skipPendingState: payload && !!payload.skipPendingState,
    })
  ),
  success: createAction(requestSuccess(actionType), _identity, mergeMeta(metaOptions)),
  fail: createAction(requestFail(actionType), _identity, mergeMeta(metaOptions)),
  reset: createAction(requestResetState(actionType)),
  setPage: createAction(setPageAction(actionType)),
  setPageSize: createAction(setPageSizeAction(actionType)),
})

export function isLoading(requestState) {
  return requestState === REQUEST_STATUS.INITIAL || requestState === REQUEST_STATUS.PENDING
}

export function needsLoading(requestState, strict = false) {
  if (strict) {
    return requestState === REQUEST_STATUS.INITIAL
  }
  return requestState === REQUEST_STATUS.INITIAL || requestState === REQUEST_STATUS.FAIL
}

export function isPending(requestState) {
  return requestState === REQUEST_STATUS.PENDING
}

export function hasSucceeded(requestState) {
  return requestState === REQUEST_STATUS.SUCCESS
}

export function hasFailed(requestState) {
  return requestState === REQUEST_STATUS.FAIL
}

export function isFresh(expirationState) {
  return expirationState === EXPIRATION_STATUS.NOT_EXPIRED
}

export function isExpired(expirationState) {
  return expirationState === EXPIRATION_STATUS.EXPIRED
}

export function isExpiredButRefreshing(expirationState) {
  return expirationState === EXPIRATION_STATUS.REFRESHING
}

export function isNotFoundStatus(statusCode) {
  return [204, 404].includes(statusCode)
}

export function convertToListRecord(data, SingleModelOrRecordCreator) {
  return List(
    (data || []).map(record => SingleModelOrRecordCreator(record))
  )
}

const getDataSubfieldPath = (payload, dataField, subfield) => {
  if (dataField.constructor === String) {
    return [dataField, subfield]
  } else if (dataField.constructor === Function) {
    return [...dataField(payload), subfield]
  } else {
    throw new Error('Invalid dataField specified: ' + dataField.toString())
  }
}

export const getErrorResponseFromPayload = payload => (
  _get(payload, 'response') ||
  _get(payload, 'error.response') ||
  { status: 400 }
)

export function requestLoopHandlersForGet(config) {
  /*
   * This function will be used for registering async request loop handlers such as GET API call.
   * It'll handle initial, success and fail cases.
   * `action`, `dataField` and `getDataFromPayload` are required as config values, and
   * getDataFromPayload should be function in the form of (payload) => (do something and return new_dataField_value)
   */
  let {
    action, dataField, initialValue, getDataFromPayload,
    onInitial, onSuccess, onFail,
    usePagination, setPageAction: _setPageAction, setPageSizeAction: _setPageSizeAction,
    preservePreviousState,
  } = config

  if (!action || !dataField || !getDataFromPayload) {
    throw new Error('action, dataField and getDataFromPayload should be set for generating get request loop handlers')
  }

  initialValue = (typeof initialValue === 'undefined') ? null : initialValue

  let initialPayload

  let paginationHandlers = {}
  if (usePagination) {
    _setPageAction = _setPageAction || setPageAction(action)
    _setPageSizeAction = _setPageSizeAction || setPageSizeAction(action)

    paginationHandlers = {
      [_setPageAction]: (state, { payload }) => state.withMutations(record =>
        record.setIn(getDataSubfieldPath(payload, dataField, 'page'), payload)),

      [_setPageSizeAction]: (state, { payload }) => state.withMutations(record =>
        record.setIn(getDataSubfieldPath(payload, dataField, 'pageSize'), payload)),
    }
  }

  return {
    [action]: (state, { payload, meta }) => state.withMutations(record => {
      // Detail data in maps may not be present in the initial state
      if (dataField.constructor === Function) {
        const dataFieldPath = dataField(payload)
        if (!record.getIn(dataFieldPath)) {
          record.setIn(dataFieldPath, DetailData())
        }
      }

      const skipPendingState = meta && meta.skipPendingState
      if (!preservePreviousState && !skipPendingState) {
        record.setIn(getDataSubfieldPath(payload, dataField, 'data'), initialValue)
      }
      if (!skipPendingState) {
        record.setIn(getDataSubfieldPath(payload, dataField, 'state'), REQUEST_STATUS.PENDING)
        if (payload && payload.id) {
          record.setIn(getDataSubfieldPath(payload, dataField, 'id'), payload.id)
        }
      }
      if (isExpired(state.getIn(getDataSubfieldPath(payload, dataField, 'expirationStatus')))) {
        record.setIn(getDataSubfieldPath(payload, dataField, 'expirationStatus'), EXPIRATION_STATUS.REFRESHING)
      }
      record.setIn(getDataSubfieldPath(payload, dataField, 'lastRequestPayload'), fromJS(payload))

      initialPayload = payload

      if (onInitial) {
        onInitial(record, payload)
      }
    }),

    [requestSuccess(action)]: (state, { payload }) => state.withMutations(record => {
      record.setIn(getDataSubfieldPath(payload, dataField, 'data'), getDataFromPayload(payload, state))
      record.setIn(getDataSubfieldPath(payload, dataField, 'state'), REQUEST_STATUS.SUCCESS)
      record.setIn(getDataSubfieldPath(payload, dataField, 'statusCode'), 200)
      record.setIn(getDataSubfieldPath(payload, dataField, 'expirationStatus'), EXPIRATION_STATUS.NOT_EXPIRED)
      if (usePagination) {
        record.setIn(getDataSubfieldPath(payload, dataField, 'count'), payload.count)
      }
      if (onSuccess) {
        onSuccess(record, payload, initialPayload)
      }
    }),

    [requestFail(action)]: (state, { payload }) => state.withMutations(record => {
      const response = getErrorResponseFromPayload(payload)
      record.setIn(getDataSubfieldPath(payload, dataField, 'data'), initialValue)
      record.setIn(getDataSubfieldPath(payload, dataField, 'state'), REQUEST_STATUS.FAIL)
      record.setIn(getDataSubfieldPath(payload, dataField, 'statusCode'), response.status)
      record.setIn(getDataSubfieldPath(payload, dataField, 'expirationStatus'), EXPIRATION_STATUS.NOT_EXPIRED)
      if (onFail) {
        onFail(record, payload, initialPayload)
      }
    }),

    [requestResetState(action)]: (state, { payload }) => state.withMutations(record => {
      record.setIn(getDataSubfieldPath(payload, dataField, 'data'), initialValue)
      record.setIn(getDataSubfieldPath(payload, dataField, 'state'), REQUEST_STATUS.INITIAL)
      record.setIn(getDataSubfieldPath(payload, dataField, 'statusCode'), -1)
      record.setIn(getDataSubfieldPath(payload, dataField, 'expirationStatus'), EXPIRATION_STATUS.NOT_EXPIRED)
    }),

    ...paginationHandlers,

  }
}

export function requestLoopHandlersForUpdate(config) {
  /*
   * This function will be used for registering async request loop handlers for update request
   * such as POST, PUT and DELETE RESTful API calls.
   * It'll handle initial, success and fail cases.
   * `action` and `stateField` are required as config values.
   */
  let {
    action, stateField,
    onInitial, onSuccess, onFail,
  } = config

  if (!action || !stateField) {
    throw new Error('action and stateField should be set for generating update request loop handlers')
  }

  let initialPayload

  return {
    [action]: (state, { payload }) => state.withMutations(record => {
      record.set(stateField, REQUEST_STATUS.PENDING)
      initialPayload = payload
      if (onInitial) {
        onInitial(record, payload)
      }
    }),

    [requestSuccess(action)]: (state, { payload }) => state.withMutations(record => {
      record.set(stateField, REQUEST_STATUS.SUCCESS)
      if (onSuccess) {
        onSuccess(record, payload, initialPayload)
      }
    }),

    [requestFail(action)]: (state, { payload }) => state.withMutations(record => {
      record.set(stateField, REQUEST_STATUS.FAIL)
      if (onFail) {
        onFail(record, payload, initialPayload)
      }
    }),

    [requestResetState(action)]: (state) => state.withMutations(record => {
      record.set(stateField, REQUEST_STATUS.INITIAL)
    }),
  }
}

export function requestLoopHandlersForGetDetailMap(config) {
  /*
   * This function will be used for registering async request loop handlers such as GET API call.
   * It'll handle initial, success and fail cases.
   * `action`, `mapField` and `getDataFromPayload` are required as config values, and
   * getDataFromPayload should be function in the form of (payload) => (do something and return new_mapField_value)
   */
  let {
    action, mapField, idField, getDataFromPayload,
    onInitial, onSuccess, onFail,
  } = config

  if (!action || !mapField || !getDataFromPayload) {
    throw new Error('action, mapField and getDataFromPayload should be set for generating get request loop handlers')
  }

  idField = idField || 'id'

  return {
    [action]: (state, { payload }) => state.withMutations(record => {
      const id = payload[idField]

      if (!state.getIn([mapField, id])) {
        record.setIn([mapField, id], DetailData())
      }

      record.setIn([mapField, id, 'state'], REQUEST_STATUS.PENDING)

      if (isExpired(state.getIn([mapField, id, 'expirationStatus']))) {
        record.setIn([mapField, id, 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)
      }
      record.setIn([mapField, id, 'lastRequestPayload'], fromJS(payload))

      if (onInitial) {
        onInitial(record, payload)
      }
    }),

    [requestSuccess(action)]: (state, { payload }) => state.withMutations(record => {
      const id = payload[idField]

      record.setIn([mapField, id, 'data'], getDataFromPayload(payload, state))
      record.setIn([mapField, id, 'state'], REQUEST_STATUS.SUCCESS)
      record.setIn([mapField, id, 'statusCode'], 200)
      record.setIn([mapField, id, 'expirationStatus'], EXPIRATION_STATUS.NOT_EXPIRED)
      if (onSuccess) {
        onSuccess(record, payload)
      }
    }),

    [requestFail(action)]: (state, { payload }) => state.withMutations(record => {
      const id = payload[idField]

      const response = getErrorResponseFromPayload(payload)
      record.setIn([mapField, id, 'data'], null)
      record.setIn([mapField, id, 'state'], REQUEST_STATUS.FAIL)
      record.setIn([mapField, id, 'statusCode'], response.status)
      record.setIn([mapField, id, 'expirationStatus'], EXPIRATION_STATUS.NOT_EXPIRED)
      if (onFail) {
        onFail(record, payload)
      }
    }),

    [requestResetState(action)]: (state, { payload }) => state.withMutations(record => {
      const id = payload[idField]

      record.setIn([mapField, id, 'data'], null)
      record.setIn([mapField, id, 'state'], REQUEST_STATUS.INITIAL)
      record.setIn([mapField, id, 'statusCode'], -1)
      record.setIn([mapField, id, 'expirationStatus'], EXPIRATION_STATUS.NOT_EXPIRED)
    }),
  }
}
