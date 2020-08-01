import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { hasSucceeded } from 'utils/state'
import { selectOAuthResult } from 'store/modules/storage'
import { login } from 'store/modules/auth'
import LoginForm from './form'


export function LoginFromSignup(props) {
  const { oauthResult, login } = props

  if (!hasSucceeded(oauthResult.state)) {
    return <Redirect to="/login" />
  }

  const email = oauthResult.data.email

  const handleSubmit = data => login({
    username: email,
    password: data.password,
  })

  return <section className="mx-auto" style={{ maxWidth: '35rem' }}>
    <div className="py-5 px-md-5 px-4 text-center DetailBlock">
      <h1 className="h5 mb-4 font-weight-bold">Welcome back!</h1>
      <p className="mb-5 text-f-md text-f-gray3">
        This cloud storage account is already paired with a Fast.io account. To log in, please enter your password below.
      </p>

      <LoginForm
        email={email}
        onSubmit={handleSubmit}
      />

      <div className="mt-5 text-f-md">
        <h2 className="mb-3 text-f-md">Wrong account?</h2>
        <Link to="/login">Log into a different account</Link>
        <div className="d-sm-inline-block mx-2">or</div>
        <Link to="/signup">Choose a different storage provider</Link>
      </div>
    </div>
  </section>
}

LoginFromSignup.propTypes = {
  oauthResult: ImmutablePropTypes.record.isRequired,
  login: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  oauthResult: selectOAuthResult,
})

const actions = {
  login,
}

export default compose(
  connect(selector, actions),
)(LoginFromSignup)
