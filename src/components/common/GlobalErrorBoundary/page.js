import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ErrorForm from './errorForm'


function ErrorPage(props) {
  const { error, onCancel, onSubmit } = props

  return <Container>
    <div className="mt-5 mx-auto text-center text-f-sm" style={{ maxWidth: '25rem' }}>
      <h5 className="mb-4">Fast.io has encountered a problem</h5>

      <div className="mb-5">
        We apologize for the inconvenience. If you send us the following error data we have generated, we might be able to prevent this from happening in the future.
      </div>
    </div>

    <div className="mt-5 mx-auto text-center text-f-sm" style={{ maxWidth: '35rem' }}>
      <ErrorForm
        error={error}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />

      <div className="mt-4 text-right">
        <Link to="/privacy">View our privacy policy</Link>
      </div>
    </div>
  </Container>
}

ErrorPage.propTypes = {
  error: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ErrorPage
