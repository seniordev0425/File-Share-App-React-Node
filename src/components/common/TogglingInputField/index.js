import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'reactstrap'


export default function TogglingInputField(props) {
  const {
    name, type, value: valueFromProps, displayValue,
    onChange, editButtonText, saveButtonText, cancelButtonText,
    children,
  } = props
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(valueFromProps)

  const handleBeginEditing = ev => {
    ev.preventDefault()

    setEditing(true)
  }

  const handleChangeValue = ev => {
    setValue(ev.target.value)
  }

  const handleKeyUp = ev => {
    if (ev.keyCode === 27) {  // ESC key
      const { value } = props
      setEditing(false)
      setValue(value)
    }
  }

  const handleCancelEditing = () => {
    setEditing(false)
    setValue(valueFromProps)
  }

  const handleSaveValue = ev => {
    setEditing(false)
    onChange(value)
  }

  return (
    editing ?
    <span className="d-inline-flex">
      <Input
        className="d-inline-block w-auto"
        bsSize="sm"
        name={name}
        type={type}
        value={value}
        onChange={handleChangeValue}
        onKeyUp={handleKeyUp}
      >
        {children}
      </Input>
      <Button className="ml-2" size="sm" onClick={handleCancelEditing}>
        {cancelButtonText}
      </Button>
      <Button className="ml-2" color="primary" size="sm" onClick={handleSaveValue}>
        {saveButtonText}
      </Button>
    </span> :
    <span>
      <span className="mr-3 text-f-gray3">
        {displayValue || valueFromProps}
      </span>
      <a href="/" onClick={handleBeginEditing}>
        {editButtonText}
      </a>
    </span>
  )
}

TogglingInputField.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  displayValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  editButtonText: PropTypes.string,
  saveButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
}

TogglingInputField.defaultProps = {
  type: 'text',
  editButtonText: 'Edit',
  saveButtonText: 'Save',
  cancelButtonText: 'Cancel',
}
