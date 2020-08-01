import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
import 'url-search-params-polyfill'

import { isPending, hasSucceeded } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import {
  selectSetPasswordState,
  setPassword,
  setPasswordReset,
} from 'store/modules/user'
import PasswordForm from './form'


export function ResetPasswordByCode(props) {
  const {
    history, location,
    setPasswordState, setPassword, setPasswordReset,
  } = props
  const params = new URLSearchParams(location.search)
  const code = params.get('code')

  const handleSubmit = data => setPassword({
    code,
    data: {
      password1: data.password,
      password2: data.password_confirm,
    },
  })

  useEffect(() => {
    setPasswordReset()
  }, [])

  usePreviousValue(setPasswordState, prev => {
    if (isPending(prev) && hasSucceeded(setPasswordState)) {
      history.push('/login')
    }
  })

  return <section className="mx-auto text-f-sm" style={{ maxWidth: '30rem' }}>
    <Row noGutters className="py-5 px-sm-5 px-4 DetailBlock text-md-left text-center">
      <Col md className="d-flex flex-column justify-content-center mb-md-0 mb-4">
        <h5 className="mb-4">Change your password</h5>

        <PasswordForm
          submitting={isPending(setPasswordState)}
          onSubmit={handleSubmit}
        />
      </Col>
    </Row>
  </section>
}

ResetPasswordByCode.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  setPasswordState: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  setPasswordReset: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  setPasswordState: selectSetPasswordState,
})

const actions = {
  setPassword,
  setPasswordReset,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(ResetPasswordByCode)
