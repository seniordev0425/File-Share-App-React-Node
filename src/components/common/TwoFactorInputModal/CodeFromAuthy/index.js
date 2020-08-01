import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'
import { TWOFACTOR_MODE } from '../constants'


function CodeFromAuthy(props) {
  const { onSubmit, setTwoFactorMode } = props

  return <>
    <div className="mb-2">
      Enter the code from your Authy app
    </div>

    <TwoFactorCodeForm onSubmit={onSubmit} />

    <div className="mt-5">
      <div className="mb-2 text-f-gray3">Or, change authentication method:</div>
      <Button
        outline
        color="primary"
        className="text-f-sm"
        onClick={() => setTwoFactorMode(TWOFACTOR_MODE.SMS)}
      >
        Text me a code
      </Button>
      <Button
        outline
        color="primary"
        className="text-f-sm ml-2"
        onClick={() => setTwoFactorMode(TWOFACTOR_MODE.CALL)}
      >
        Call me with a code
      </Button>
    </div>

    <div className="mt-5">
      <div className="mb-1 text-f-gray3">Don't already have the Authy app?</div>
      No problem. You can send an SMS code above or just set up Authy with the same phone number you use with Fast.io and Authy will automatically add your Fast.io security code.<br />
      <a
        href="https://authy.com/download/"
        className="mt-3 d-block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Authy
      </a>
    </div>
  </>
}

CodeFromAuthy.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setTwoFactorMode: PropTypes.func.isRequired,
}

export default CodeFromAuthy
