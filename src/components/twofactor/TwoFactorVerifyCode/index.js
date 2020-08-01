import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button } from 'reactstrap'

import { isPending, hasSucceeded } from 'utils/state'
import { selectUser } from 'store/modules/user'
import {
  TWOFACTOR_PREFERENCE,
  selectVerifyCodeState,
  selectVerifyCodeResult,
  verifyTwoFactor,
  setTwoFactorPreference,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'
import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'


export function TwoFactorVerifyCode(props) {
  const {
    history, match, user, verifyCodeState, verifyTwoFactor, setTwoFactorPreference,
  } = props
  const method = match.params.method

  const handleSubmit = data => {
    setTwoFactorPreference(
      method === 'call' ?
      TWOFACTOR_PREFERENCE.CALL :
      TWOFACTOR_PREFERENCE.SMS
    )
    verifyTwoFactor(data)
  }

  const handleResend = () => history.push(`/twofactor/sendcode/${method}`)

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
      !pending && <>
        <div className="mx-auto" style={{ maxWidth: '30rem' }}>
          <h6 className="mb-4">Enter verification code</h6>
          <div className="mb-2">
            Enter the verification code we sent to +{user.data.phone_country}{user.data.phone_number}.
            <Link
              className="ml-2"
              to="/twofactor/addphone/reset"
            >
              Change
            </Link>
          </div>

          <TwoFactorCodeForm
            onSubmit={handleSubmit}
            onResend={handleResend}
          />

          <div className="mt-5">
            <div className="mb-2 text-f-gray3">Or, change authentication method:</div>
            <Button
              outline
              color="primary"
              className="text-f-sm"
              tag={Link}
              to="/twofactor/verifyauthy"
            >
              Use Authy app
            </Button>
            <Button
              outline
              color="primary"
              className="text-f-sm ml-2"
              tag={Link}
              to={`/twofactor/sendcode/${method === 'call' ? 'sms' : 'call'}`}
            >
              {
                method === 'call' ?
                'Text me a code' :
                'Call me with a code'
              }
            </Button>
          </div>
        </div>
      </>
    }
  </section>
}

TwoFactorVerifyCode.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  verifyCodeState: PropTypes.string.isRequired,
  verifyCodeResult: PropTypes.string.isRequired,
  verifyTwoFactor: PropTypes.func.isRequired,
  setTwoFactorPreference: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
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
)(TwoFactorVerifyCode)
