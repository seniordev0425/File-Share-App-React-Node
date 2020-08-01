import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { STORAGE_NAME_MAP } from 'constants/common'
import { isLoading, isPending, hasSucceeded, hasFailed } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import {
  selectPasswordCodeData,
  selectSetPasswordState,
  checkPasswordCode,
  setPassword,
} from 'store/modules/user'
import { selectOAuthResult } from 'store/modules/storage'
import { login } from 'store/modules/auth'
import Spinner from 'components/common/Spinner'
import PasswordForm from './form'
import { faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';


export function SetPassword(props) {
  const {
    oauthResult,
    passwordCodeData, checkPasswordCode,
    setPasswordState, setPassword,
  } = props
  const storage = oauthResult.data && oauthResult.data.provider
  const storageName = storage && STORAGE_NAME_MAP[storage]

  if (!hasSucceeded(oauthResult.state)) {
    return <Redirect to="/login" />
  }

  const code = oauthResult.data.password
  const [enteredPassword, setEnteredPassword] = useState('')

  const handleSubmit = data => {
    setEnteredPassword(data.password)
    setPassword({
      code,
      data: {
        password1: data.password,
        password2: data.password,
      }
    })
  }

  useDataLoadEffect(passwordCodeData, checkPasswordCode, () => ({ code }))

  usePreviousValue(setPasswordState, prev => {
    if (isPending(prev) && hasSucceeded(setPasswordState)) {
      // Password set successfully, now login
      login({
        username: passwordCodeData.data.email,
        password: enteredPassword,
      })
    }
  })

  return <section className="mx-auto" style={{ maxWidth: '35rem' }}>
    <div className="pb-5 pt-md-5 pt-4 px-md-5 px-4 DetailBlock">
      {
        isLoading(passwordCodeData.state) && <Spinner />
      }

      {
        hasFailed(passwordCodeData.state) && 'Invalid password code.'
      }

      {
        hasSucceeded(passwordCodeData.state) && <>
          <div className="text-center overflow-auto p-md-4 p-3 rounded-lg bg-f-gray15 text-f-md text-f-gray3">
            <div className={`d-flex mb-4 mx-auto rounded-circle bg-white shadow-sm Storage-${storage}`}>
              <FontAwesomeIcon icon={faCheckCircle} size="lg" className="text-f-color2" />
            </div>
            <p className="mb-4">
              Thank you for connecting your {storageName} account! Your email address will be your login for Fast:
            </p>
            <span className="d-inline-block text-white text-nowrap rounded-pill py-1 px-3 mb-3 bg-f-gray3">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-f-color4" />
              {passwordCodeData.data.email}
            </span>
          </div>

          <PasswordForm
            submitting={isPending(setPasswordState)}
            onSubmit={handleSubmit}
          />
        </>
      }
    </div>
  </section>
}

SetPassword.propTypes = {
  oauthResult: ImmutablePropTypes.record.isRequired,
  passwordCodeData: ImmutablePropTypes.record.isRequired,
  setPasswordState: PropTypes.string.isRequired,
  checkPasswordCode: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  oauthResult: selectOAuthResult,
  passwordCodeData: selectPasswordCodeData,
  setPasswordState: selectSetPasswordState,
})

const actions = {
  checkPasswordCode,
  setPassword,
}

export default compose(
  connect(selector, actions),
)(SetPassword)
