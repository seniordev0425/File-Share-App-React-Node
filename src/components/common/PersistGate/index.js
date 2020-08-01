import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'

import { APP_VERSION } from 'constants/env'
import { trackActivity } from 'utils/analytics'
import { persistor } from 'store'
import { selectRehydrated } from 'store/modules/persist'
import {
  selectCachedVersion,
} from 'store/modules/system'
import Spinner from 'components/common/Spinner'


function PersistGate(props) {
  const {
    store, rehydrated, cachedVersion,
    children,
  } = props

  const purgeCache = () => {
    const keysToPurge = store.keySeq().filter(
      key => key !== 'auth'
    ).toJS()
    persistor.purge(keysToPurge)
  }

  useEffect(() => {
    if (rehydrated && cachedVersion && cachedVersion !== APP_VERSION) {
      persistor.pause()
      purgeCache()

      trackActivity('Flushing browser data cache because front end is updated', {
        previousVersion: cachedVersion,
        cachedVersion: APP_VERSION,
      })

      setTimeout(() => window.location.reload(), 100)
    }
  }, [rehydrated])

  return (
    rehydrated && cachedVersion === APP_VERSION ?
    children :
    <Spinner />
  )
}

PersistGate.propTypes = {
  rehydrated: PropTypes.bool.isRequired,
  cachedVersion: PropTypes.string.isRequired,
}

const selector = createStructuredSelector({
  store: store => store,
  rehydrated: selectRehydrated,
  cachedVersion: selectCachedVersion,
})

export default compose(
  withRouter,
  connect(selector),
)(PersistGate)
