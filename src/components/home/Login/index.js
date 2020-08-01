import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { handleLoginFormFieldError } from 'utils/formErrors'
import { isPending } from 'utils/state'
import {
  selectLoginState,
  selectAuthToken,
  login,
} from 'store/modules/auth'
import LoginForm from '../LoginForm'
import './index.css'


export function Login(props) {
  const { loginState, login } = props

  const handleSubmit = (data, form, callback) => {
    const { username, password } = data
    login({
      username,
      password,
      meta: {
        form: {
          callback,
          errorHandler: handleLoginFormFieldError
        }
      }
    })
  }

  return <section className="mx-auto" style={{ maxWidth: '35rem' }}>
    <div className="py-5 px-md-5 px-4 text-center DetailBlock">
      <h1 className="h5 mb-4 font-weight-bold">Log In</h1>
      <p className="mb-5 text-f-md text-f-gray3">
        Welcome back!
      </p>

      <LoginForm
        submitting={isPending(loginState)}
        onSubmit={handleSubmit}
      />

      <div className="mt-4 text-f-md">
        <span className="d-inline-block mx-2">Don't have an account?</span>
        <Link
          to="/signup"
          className="text-nowrap"
        >
          Sign Up
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </Link>
      </div>
    </div>
  </section>
}

Login.propTypes = {
  loginState: PropTypes.string.isRequired,
  authToken: PropTypes.string,
  login: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  loginState: selectLoginState,
  authToken: selectAuthToken,
})

const actions = {
  login,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(Login)
