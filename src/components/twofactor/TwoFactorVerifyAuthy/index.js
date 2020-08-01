import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

import { isPending, hasSucceeded } from 'utils/state'
import {
  TWOFACTOR_PREFERENCE,
  selectVerifyCodeState,
  selectVerifyCodeResult,
  verifyTwoFactor,
  setTwoFactorPreference,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'
import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'


export function TwoFactorVerifyAuthy(props) {
  const {
    history, verifyCodeState, verifyTwoFactor, setTwoFactorPreference,
  } = props

  const handleSubmit = data => {
    setTwoFactorPreference(TWOFACTOR_PREFERENCE.AUTHY)
    verifyTwoFactor(data)
  }

  useEffect(() => {
    if (hasSucceeded(verifyCodeState)) {
      history.push('/account/user')
    }
  }, [verifyCodeState])

  const pending = isPending(verifyCodeState)

  return <section className="p-5">
    {
      pending && <Spinner />
    }

    {
      !pending && <div className="mx-auto" style={{ maxWidth: '30rem' }}>
        <h6 className="mb-4">Enter Authy 2-factor code</h6>
        <div className="mb-2">
          Enter the code from your Authy app
        </div>

        <TwoFactorCodeForm onSubmit={handleSubmit} />

        <div className="mt-5">
          <div className="mb-2 text-f-gray3">Or, change authentication method:</div>
          <Button
            outline
            color="primary"
            className="text-f-sm"
            tag={Link}
            to="/twofactor/enable/sms"
          >
            Text me a code
          </Button>
          <Button
            outline
            color="primary"
            className="text-f-sm ml-2"
            tag={Link}
            to="/twofactor/enable/call"
          >
            Call me with a code
          </Button>
        </div>

        <div className="mt-5">
          <div className="mb-1 text-f-gray3">Don't already have the Authy app?</div>
          No problem. You can send an SMS code above or just set up Authy with the same phone number you use with Fast.io and Authy will automatically add your Fast.io security code.<br />
          <a
            href="https://authy.com/download/"
            className="mt-3 d-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Authy
          </a>
        </div>
      </div>
    }
  </section>
}

TwoFactorVerifyAuthy.propTypes = {
  history: PropTypes.object.isRequired,
  verifyCodeState: PropTypes.string.isRequired,
  verifyCodeResult: PropTypes.string.isRequired,
  verifyTwoFactor: PropTypes.func.isRequired,
  setTwoFactorPreference: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  verifyCodeState: selectVerifyCodeState,
  verifyCodeResult: selectVerifyCodeResult,
})

const actions = {
  verifyTwoFactor,
  setTwoFactorPreference,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(TwoFactorVerifyAuthy)
