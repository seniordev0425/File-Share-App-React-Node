import React from 'react'
import PropTypes from 'prop-types'


export default function TFAMark({ show, style }) {
  return !!show && <span
    className="d-inline-block rounded-pill text-white font-weight-bold ml-2 bg-f-gray4"
    style={{
      fontSize: '.625rem',
      padding: '1px 8px',
      ...style,
    }}
  >
    2FA
  </span>
}

TFAMark.propTypes = {
  show: PropTypes.bool,
  style: PropTypes.object,
}
