import React from 'react'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import { Col } from 'reactstrap'
import PropTypes from 'prop-types'

import TwoFactorCodeForm from '../TwoFactorCodeForm'


export function TwoFactorLoginByAuthy(props) {
  const { history } = props

  const handleSubmit = data => {
    history.push(`/login/twofactor/code/${data.code}`)
  }

  return <section className="mx-auto" style={{ maxWidth: '35rem' }}>
    <div className="py-5 px-md-5 px-4 text-center overflow-auto DetailBlock">
      <h1 className="h5 mb-4 font-weight-bold">Enter Authy 2-Factor Code</h1>
      <p className="mb-5 text-f-gray3 text-f-md">
        Enter the code from your Authy app
      </p>

      <TwoFactorCodeForm
        onSubmit={handleSubmit}
      />

      <div className="mt-5">
        <h2 className="text-f-md mb-4">Or, change authentication method:</h2>
          <div className="form-row mb-5">
          <Col sm>
            <Link
              to="/login/twofactor/phone/sms"
              className="btn btn-outline-primary w-100 mb-sm-0 mb-3 text-f-sm"
            >
              Text Me a Code
            </Link>
          </Col>
          <Col sm>
            <Link
              to="/login/twofactor/phone/call"
              className="btn btn-outline-primary w-100 text-f-sm"
            >
              Call Me with Code
            </Link>
          </Col>
        </div>
        <h2 className="text-f-md mb-4">Don't already have the Authy app?</h2>
        <p className="mb-0 text-f-sm">
          No problem. You can send an SMS code above or just set up Authy with the same number phone number you use with Fast.io and
          Authy will automatically add your Fast.io security code. <a
            href="https://authy.com/download/"
            className="text-nowrap"
            target="_blank"
            rel="noopener noreferrer"
          >Download Authy</a>
        </p>
      </div>
    </div>
    <p className="py-5 px-md-5 px-0 text-center text-f-sm">
      Powered by{' '}
      <a href="https://authy.com/" target="_blank" rel="noopener noreferrer">
        Authy{' '}
        <span className="align-text-bottom">
          <svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M256 127.998C256 198.696 198.694 256 127.997 256 57.304 256 0 198.696 0 127.998 0 57.305 57.304 0 127.997 0 198.694 0 256 57.305 256 127.998z" fill="#EC1C24"/><path d="M117.024 100.89l30.691 30.68c4.43 4.436 11.623 4.436 16.064 0 4.431-4.435 4.441-11.622 0-16.058L133.086 84.82c-21.961-21.966-57.455-22.32-79.882-1.116a9.536 9.536 0 0 0-.605.548c-.098.098-.178.202-.275.29-.1.096-.202.182-.297.278a9.039 9.039 0 0 0-.54.597c-21.215 22.437-20.85 57.932 1.113 79.897L83.292 196c4.44 4.433 11.623 4.433 16.062 0 4.442-4.437 4.442-11.633.011-16.06l-30.693-30.691c-13.398-13.393-13.488-35.129-.278-48.637 13.506-13.21 35.23-13.114 48.63.279zm39.612-40.873c-4.435 4.437-4.435 11.623.012 16.059l30.681 30.693c13.39 13.392 13.477 35.125.268 48.636-13.51 13.2-35.227 13.112-48.623-.282l-30.692-30.689c-4.438-4.437-11.633-4.437-16.066 0-4.443 4.433-4.443 11.642 0 16.065l30.682 30.694c21.968 21.965 57.458 22.322 79.889 1.116.208-.184.404-.355.61-.549.094-.095.182-.192.273-.29.1-.095.197-.183.29-.289.197-.183.365-.384.54-.594 21.215-22.428 20.86-57.911-1.102-79.889l-30.692-30.682c-4.436-4.443-11.638-4.443-16.07.001z" fill="#FFF"/></svg>
        </span>
      </a>
    </p>
  </section>
}

TwoFactorLoginByAuthy.propTypes = {
  history: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
)(TwoFactorLoginByAuthy)
