import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { hasSucceeded, hasFailed } from 'utils/state'
import {
  useDataLoadEffect,
  usePreviousValue,
} from 'utils/hooks'
import {
  TWOFACTOR_STATE,
  selectTwoFactor,
  selectAddTwoFactorState,
  resetTwoFactorAddingProcess,
  getTwoFactor,
  addTwoFactor,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'


export function TwoFactorEnable(props) {
  const {
    history, match, twoFactor, getTwoFactor,
    resetTwoFactorAddingProcess, addTwoFactorState, addTwoFactor,
  } = props
  const method = match.params.method

  const goToNextStep = () => history.push(
    method === 'sms' || method === 'call' ?
    `/twofactor/sendcode/${method}` :
    '/twofactor/verifyauthy'
  )

  useEffect(() => {
    resetTwoFactorAddingProcess()
  }, [])

  useDataLoadEffect(
    twoFactor,
    getTwoFactor,
    e => e,
    null,
    [twoFactor]
  )

  usePreviousValue(twoFactor, prevTwoFactor => {
    if (
      !hasSucceeded(prevTwoFactor.state) &&
      hasSucceeded(twoFactor.state)
    ) {
      if (twoFactor.data === TWOFACTOR_STATE.DISABLED) {
        addTwoFactor()
      } else {
        goToNextStep()
      }
    }
  })

  useEffect(() => {
    if (hasSucceeded(addTwoFactorState)) {
      goToNextStep()
    }
  }, [addTwoFactorState])

  return <>
    {
      hasFailed(addTwoFactorState) && <div className="text-center my-5 px-3">
        Failed to enable two-factor authentication on your account.
      </div>
    }

    {
      !hasFailed(addTwoFactorState) && <Spinner />
    }
  </>
}

TwoFactorEnable.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  twoFactor: ImmutablePropTypes.record.isRequired,
  addTwoFactorState: PropTypes.string.isRequired,
  resetTwoFactorAddingProcess: PropTypes.func.isRequired,
  getTwoFactor: PropTypes.func.isRequired,
  addTwoFactor: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  twoFactor: selectTwoFactor,
  addTwoFactorState: selectAddTwoFactorState,
})

const actions = {
  resetTwoFactorAddingProcess,
  getTwoFactor,
  addTwoFactor,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(TwoFactorEnable)
