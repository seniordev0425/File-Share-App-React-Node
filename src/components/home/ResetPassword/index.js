import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'

import { usePreviousValue } from 'utils/hooks'

import { isPending, hasSucceeded } from 'utils/state'
import {
  selectResetPasswordState,
  resetPassword
} from 'store/modules/user'
import EmailForm from './form'


export function ResetPassword(props) {
  const { resetPasswordState, resetPassword, history } = props

  const handleSubmit = data => {
    resetPassword(data)
  }

  usePreviousValue(resetPasswordState, prev => {
    if (isPending(prev) && hasSucceeded(resetPasswordState)) {
      history.push(`/password/reset/success`)
    }
  })

  return <section className="mx-auto text-f-sm" style={{ maxWidth: '30rem' }}>
    <Row noGutters className="py-5 px-sm-5 px-4 DetailBlock text-md-left text-center">
      <Col md className="d-flex flex-column justify-content-center mb-md-0 mb-4">
        <h5 className="mb-3">Forgot your password? No problem.</h5>

        <label>
          Please enter the email address from the cloud storage provider you signed up with. We'll send you
          a recover email.
        </label>

        <EmailForm
          submitting={isPending(resetPasswordState)}
          onSubmit={handleSubmit}
        />

        <div className="mt-3">
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>
      </Col>
    </Row>
  </section>
}


ResetPassword.propTypes = {
  history: PropTypes.object.isRequired,
  resetPasswordState: PropTypes.string.isRequired,
  resetPassword: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  resetPasswordState: selectResetPasswordState,
})

const actions = {
  resetPassword
}

export default compose(
  connect(selector, actions),
)(ResetPassword)
