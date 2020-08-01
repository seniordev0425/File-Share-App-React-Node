import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'


import {
  TWOFACTOR_PREFERENCE,
  selectPreference,
} from 'store/modules/twofactor'


export function TwoFactorLogin(props) {
  const { twoFactorPreference } = props

  let redirectRoute = ''
  if (twoFactorPreference === TWOFACTOR_PREFERENCE.SMS) {
    redirectRoute = '/login/twofactor/phone/sms'
  } else if (twoFactorPreference === TWOFACTOR_PREFERENCE.CALL) {
    redirectRoute = '/login/twofactor/phone/call'
  } else {
    redirectRoute = '/login/twofactor/authy'
  }

  return <Redirect to={redirectRoute} />
}

TwoFactorLogin.propTypes = {
  twoFactorPreference: PropTypes.string.isRequired,
}

const selector = createStructuredSelector({
  twoFactorPreference: selectPreference,
})

export default compose(
  connect(selector),
)(TwoFactorLogin)
