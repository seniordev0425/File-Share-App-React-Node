import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons'


export default function TwoFactorLayout(props) {
  const { children } = props

  return <div className="text-f-sm">
    <div className="mt-3 mx-3">
      <Button outline color="primary" className="border-0 BackButton text-f-sm float-left" tag={Link} to="/account/user">
        <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
        Back
      </Button>

      <div className="float-right text-right">
        Powered by Authy<br />
        <a href="/" target="_blank" rel="noreferrer noopener">Learn more</a>
      </div>
    </div>

    <div style={{ clear: 'both', padding: '1px 0' }}>
      {children}
    </div>
  </div>
}
