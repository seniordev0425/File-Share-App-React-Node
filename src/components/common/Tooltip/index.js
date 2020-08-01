import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { UncontrolledTooltip } from 'reactstrap'

const Tooltip = ({ children, placement = 'top', tooltip }) => {
  const anchorRef = useRef()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (anchorRef.current) {
      setReady(true)
    }
  }, [anchorRef.current])

  return (
    <>
      <span ref={anchorRef} className="js-tooltip-anchor">
        {children}
      </span>
      {tooltip && ready && (
        <UncontrolledTooltip placement={placement} target={anchorRef}>
          {tooltip}
        </UncontrolledTooltip>
      )}
    </>
  )
}

Tooltip.propTypes = {
  tooltip: PropTypes.string,
  placement: PropTypes.oneOf([
    'auto',
    'auto-start',
    'auto-end',
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
  ]),
  children: PropTypes.node.isRequired
}

export default Tooltip
