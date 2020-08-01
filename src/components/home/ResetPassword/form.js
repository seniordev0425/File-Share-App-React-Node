import React from 'react'
import { Form, Field } from 'react-final-form'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
  isEmail,
} from 'utils/validation'


export default function EmailForm(props) {
  const { submitting, onSubmit } = props

  const handleSubmit = data => onSubmit(data)

  return <Form
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <Field
            name="email_address"
            component={FormInput}
            validate={composeValidators(
              required('Please enter your email address'),
              isEmail('Should be valid email address')
            )}
          />
        </div>

        <Button
          type="submit"
          color="success"
          className="w-100"
          disabled={submitting}
        >
          Recover
        </Button>
      </form>
    )}
  />
}

EmailForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
