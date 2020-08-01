import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { UncontrolledTooltip } from 'reactstrap'


function DisabledLink({ className, children, title, ...restProps }) {
  const idNum = Math.floor(Math.random() * 99999)
  const [linkId] = useState(`disabled_link_${idNum}`)
  const onClickHandler = ev => ev.preventDefault()

  return <>
    <a className={cx(className, 'text-muted')} {...restProps} id={linkId} href="/" onClick={onClickHandler}>
      {children}
    </a>

    {
      title && <UncontrolledTooltip target={linkId}>
        {title}
      </UncontrolledTooltip>
    }
  </>
}

DisabledLink.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
}

export default DisabledLink
