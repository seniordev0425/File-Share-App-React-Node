import { useEffect, useRef } from 'react'
import { fromJS } from 'immutable'

import { shallowCompareMaps } from 'utils/data'
import { needsLoading, hasSucceeded, isExpired } from 'utils/state'


export const createLoadDataHandler = (
  field,
  dataLoadAction,
  payloadCreator,
  loadConditionCheck = null,
  loadOnlyWhenExpired = false,
) => () => {
  const payload = payloadCreator && payloadCreator()

  if (!loadOnlyWhenExpired) {
    const _needsLoading = (
      !field ||
      needsLoading(field.state) ||
      (payloadCreator && !shallowCompareMaps(
        field.lastRequestPayload,
        fromJS(payload)
      ))
    )
    // Load data when it isn't loaded already
    if ((loadConditionCheck || (e => e))(_needsLoading)) {
      dataLoadAction(payload)
    }
  }

  // Reload data in the background when expired
  if (
    field &&
    hasSucceeded(field.state) &&
    isExpired(field.expirationStatus)
  ) {
    dataLoadAction({
      ...payload,
      skipPendingState: true,
    })
  }
}

export const useDataLoadEffect = (
  field,
  dataLoadAction,
  payloadCreator,
  loadConditionCheck = null,
  dependency = [],
) => {
  // Initial data loading
  useEffect(
    createLoadDataHandler(field, dataLoadAction, payloadCreator, loadConditionCheck),
    dependency
  )

  // Refreshing data when loaded data expired
  useEffect(
    createLoadDataHandler(field, dataLoadAction, payloadCreator, loadConditionCheck, true),
    [field]
  )
}

export const usePreviousValue = (value, callback) => {
  const ref = useRef()
  useEffect(() => {
    if (typeof ref.current !== 'undefined') {
      callback(ref.current)
    }
    ref.current = value
  }, [value])
}

const addCssClass = (element, className) => element.classList.add(className)
const removeCssClass = (element, className) => element.classList.remove(className)

export const useCssClass = (element, className) => {
  useEffect(() => {
    className instanceof Array
      ? className.map(addCssClass.bind(this, element))
      : addCssClass(element, className)

    return () => {
      className instanceof Array
        ? className.map(removeCssClass.bind(this, element))
        : removeCssClass(className)
    }
  }, [className])
}
