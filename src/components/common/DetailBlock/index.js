import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'


const DetailBlock = props => {
  const {
    header, headerClassName,
    className, noHeaderWrap,
    children,
  } = props

  return <div className={cx("py-4 DetailBlock", className)}>
    {noHeaderWrap ? (
      header
    ) : (
      <h2
        className={cx(
          'h6 pb-4 d-flex px-4 mb-3 border-bottom DetailBlock-heading border-f-gray15',
          headerClassName
        )}
      >
        {header}
      </h2>
    )}
    <div className="px-sm-5 px-4 py-2">
      {children}
    </div>
  </div>
}

DetailBlock.propTypes = {
  header: PropTypes.node,
  headerClassName: PropTypes.string,
  className: PropTypes.string,
  noHeaderWrap: PropTypes.bool,
  children: PropTypes.node,
}

export default DetailBlock
