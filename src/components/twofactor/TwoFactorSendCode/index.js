import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { isPending, hasSucceeded, hasFailed } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import {
  selectSendCodeState,
  resetSendTwoFactorCode,
  sendTwoFactorCodeBySMS,
  sendTwoFactorCodeByCall,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'


export function TwoFactorSendCode(props) {
  const {
    history, match,
    sendCodeState, resetSendTwoFactorCode, sendTwoFactorCodeBySMS, sendTwoFactorCodeByCall,
  } = props
  const method = match.params.method

  const goToNextStep = () => history.push(`/twofactor/verifycode/${method}`)

  useEffect(() => {
    resetSendTwoFactorCode()
  }, [])

  useEffect(() => {
    if (method === 'sms') {
      sendTwoFactorCodeBySMS()
    } else if (method === 'call') {
      sendTwoFactorCodeByCall()
    } else {
      console.error('`send` query parameter is invalid or missing.')
      history.push('/twofactor/addphone')
    }
  }, [])

  usePreviousValue(sendCodeState, prev => {
    if (isPending(prev) && hasSucceeded(sendCodeState)) {
      goToNextStep()
    }
  })

  return <>
    {
      hasFailed(sendCodeState) && <div className="text-center my-5 px-3">
        Failed to send two-factor authentication code to your phone number by {method === 'sms' ? 'SMS' : 'call'}.
      </div>
    }

    {
      !hasFailed(sendCodeState) && <Spinner />
    }
  </>
}

TwoFactorSendCode.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  sendCodeState: PropTypes.string.isRequired,
  resetSendTwoFactorCode: PropTypes.func.isRequired,
  sendTwoFactorCodeByCall: PropTypes.func.isRequired,
  sendTwoFactorCodeBySMS: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  sendCodeState: selectSendCodeState,
})

const actions = {
  resetSendTwoFactorCode,
  sendTwoFactorCodeByCall,
  sendTwoFactorCodeBySMS,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(TwoFactorSendCode)
