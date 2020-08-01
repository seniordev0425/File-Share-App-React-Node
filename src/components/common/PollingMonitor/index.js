import { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import _max from 'lodash/max'

import { POLL_THROTTLE_BIG } from 'constants/common'
import { isPending, hasFailed } from 'utils/state'
import { RenderOnlyForAuthenticated } from 'hoc/authWrappers'
import { moduleMap } from 'store/persist'
import {
  selectPollResult,
  poll,
} from 'store/modules/poll'
import {
  selectIsRefreshing,
  expirePersistedData,
} from 'store/modules/persist'


export function PollingMonitor(props) {
  const {
    isRefreshing,
    pollResult, poll, expirePersistedData,
  } = props
  const [pollTimes, setPollTimes] = useState([])
  const [pollTimer, setPollTimer] = useState(null)

  const doPoll = payload => !document.hidden && !isPending(pollResult.state) && poll(payload)

  const doTimedPoll = (func, timeout) => {
    if (pollTimer) {
      clearTimeout(pollTimer)
    }
    setPollTimer(
      setTimeout((...args) => {
        setPollTimer(null)
        func(...args)
      }, timeout)
    )
  }

  const handleActivityChange = () => {
    if (isRefreshing) {
      return
    }

    const pollPayload = {
      lastactivity: (
        pollResult.data &&
        _max(Object.values(pollResult.data.activity.toJS()))
      ) || '',
      wait: 0,
      onSuccess: setTimeout.bind(this, (payload, initialPayload) => {
        if (!payload.activity) {
          return
        }

        // Using setTimeout here because actions should not be dispatched within reducer,
        // and this onSuccess is called inside reducer
        let expiredModules = []
        Object.keys(payload.activity).forEach(activityWithKey => {
          const activity = activityWithKey.split('=')[0]
          if (activity && moduleMap[activity] && moduleMap[activity].length > 0) {
            expiredModules = expiredModules.concat(moduleMap[activity])
          }
        })

        if (
          expiredModules.length > 0 &&
          initialPayload.updated
        ) {
          expirePersistedData(expiredModules)
        }
      }, 0)
    }

    if (pollPayload.lastactivity) {
      pollPayload.wait = 55
      pollPayload.updated = true
    }

    if (hasFailed(pollResult.state)) {
      // If previous poll failed, retry after 5 seconds
      doTimedPoll(() => doPoll(pollPayload), 5000)
    } else if (!isPending(pollResult.state)) {
      const currentTime = new Date().getTime()
      let waitTime = Math.min(
        pollTimes.length > 1 ?
        POLL_THROTTLE_BIG - (currentTime - pollTimes[pollTimes.length - 2]) :
        0
      )

      if (waitTime > 0) {
        doTimedPoll(() => {
          setPollTimes([])
          doPoll(pollPayload)
        }, Math.max(waitTime, 100))
      } else {
        let newPollTimes = pollTimes.slice()
        newPollTimes.push(currentTime)
        newPollTimes = newPollTimes.slice(-2)
        setPollTimes(newPollTimes)
        doPoll(pollPayload)
      }
    }
  }

  // Watch for activity changes
  useEffect(handleActivityChange, [pollResult, isRefreshing])

  useEffect(() => {
    const savedHandleActivityChange = handleActivityChange
    window.addEventListener('online', savedHandleActivityChange)
    document.addEventListener('visibilitychange', savedHandleActivityChange)
    return () => {
      window.removeEventListener('online', savedHandleActivityChange)
      document.removeEventListener('visibilitychange', savedHandleActivityChange)
    }
  }, [])

  return false
}

PollingMonitor.propTypes = {
  store: ImmutablePropTypes.map.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  pollResult: ImmutablePropTypes.record.isRequired,
  poll: PropTypes.func.isRequired,
  expirePersistedData: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  store: store => store,
  isRefreshing: selectIsRefreshing,
  pollResult: selectPollResult,
})

const actions = {
  poll,
  expirePersistedData,
}

export default compose(
  RenderOnlyForAuthenticated,
  withRouter,
  connect(selector, actions),
)(PollingMonitor)
