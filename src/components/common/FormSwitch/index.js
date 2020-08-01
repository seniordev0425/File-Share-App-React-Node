import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'


function FormSwitch({ input, className, caption = ['Disabled', 'Enabled'], disabled }) {
  const id = `switch-${input.name}`
  return <div className={cx("custom-control custom-switch", className)}>
    <input
      {...input}
      disabled={disabled}
      type="checkbox"
      id={id}
      className="custom-control-input"
      checked={!disabled && input.value}
    />
    <label className="custom-control-label" htmlFor={id}>
      {caption instanceof Array 
        ? (input.value ? caption[1] : caption[0])
        : caption}
    </label>
  </div>
}

FormSwitch.propTypes = {
  input: PropTypes.object.isRequired,
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.string.isRequired
    )
  ]),
  meta: PropTypes.object,
}

export default FormSwitch
