import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button } from 'reactstrap'

import { isPending } from 'utils/state'
import { selectUser } from 'store/modules/user'
import {
  selectSendCodeState,
  resetSendTwoFactorCode,
  sendTwoFactorCodeByCall,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'
import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'
import { TWOFACTOR_MODE } from '../constants'


export function CodeFromCall(props) {
  const {
    user, onSubmit, setTwoFactorMode,
    sendCodeState, resetSendTwoFactorCode, sendTwoFactorCodeByCall,
  } = props

  const handleResend = () => sendTwoFactorCodeByCall()

  useEffect(() => {
    resetSendTwoFactorCode()
    sendTwoFactorCodeByCall()
  }, [])

  if (isPending(sendCodeState)) {
    return <Spinner />
  }

  return <>
    <div className="mb-2">
      Enter the verification code we sent to +{user.data.phone_country}{user.data.phone_number}.
    </div>

    <TwoFactorCodeForm
      onSubmit={onSubmit}
      onResend={handleResend}
    />

    <div className="mt-5">
      <div className="mb-2 text-f-gray3">Or, change authentication method:</div>
      <Button
        outline
        color="primary"
        className="text-f-sm"
        onClick={() => setTwoFactorMode(TWOFACTOR_MODE.AUTHY)}
      >
        Use Authy app
      </Button>
      <Button
        outline
        color="primary"
        className="text-f-sm ml-2"
        onClick={() => setTwoFactorMode(TWOFACTOR_MODE.SMS)}
      >
        Text me a code
      </Button>
    </div>
  </>
}

CodeFromCall.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setTwoFactorMode: PropTypes.func.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  sendCodeState: PropTypes.string.isRequired,
  resetSendTwoFactorCode: PropTypes.func.isRequired,
  sendTwoFactorCodeByCall: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  sendCodeState: selectSendCodeState,
})

const actions = {
  resetSendTwoFactorCode,
  sendTwoFactorCodeByCall,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(CodeFromCall)
