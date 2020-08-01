import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { isPending, hasSucceeded, hasFailed } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import {
  loginFromTwoFactor,
} from 'store/modules/auth'
import {
  selectTwoFactorAuth,
  authenticateTwoFactor,
  authenticateTwoFactorReset,
} from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'


export function TwoFactorVerifyCode(props) {
  const {
    match, loginFromTwoFactor,
    twoFactorAuth, authenticateTwoFactor, authenticateTwoFactorReset,
  } = props
  const code = match.params.code

  useEffect(() => {
    authenticateTwoFactorReset()
    authenticateTwoFactor({
      code,
    })
  }, [])

  usePreviousValue(twoFactorAuth, prev => {
    if (isPending(prev.state) && hasSucceeded(twoFactorAuth.state)) {
      loginFromTwoFactor(twoFactorAuth.data)
    }
  })

  return hasFailed(twoFactorAuth.state) ?
    <div>Invalid 2-factor authentication code.</div> :
    <Spinner />
}

TwoFactorVerifyCode.propTypes = {
  match: PropTypes.object.isRequired,
  twoFactorAuth: ImmutablePropTypes.record.isRequired,
  authenticateTwoFactor: PropTypes.func.isRequired,
  authenticateTwoFactorReset: PropTypes.func.isRequired,
  loginFromTwoFactor: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  twoFactorAuth: selectTwoFactorAuth,
})

const actions = {
  authenticateTwoFactor,
  authenticateTwoFactorReset,
  loginFromTwoFactor,
}

export default compose(
  connect(selector, actions),
)(TwoFactorVerifyCode)
