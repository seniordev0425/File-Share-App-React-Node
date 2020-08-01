import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './index.css'


function Spinner({ complete }) {
  return <div className={cx('circleLoader', {
    'load-complete': complete,
  })}>
    <div className="checkmark draw" />
  </div>
}

Spinner.propTypes = {
  complete: PropTypes.bool,
}

export default Spinner
