import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import { Button, Form, FormGroup, Label } from 'reactstrap'

import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
  minLength,
} from 'utils/validation'


export default function PasswordForm(props) {
  const { submitting, onSubmit } = props

  const validateForm = (values) => {
    const errors = {}
    if (values.password !== values.password_confirm) {
      errors.password_confirm = 'Please confirm your password'
    }
    return errors
  }

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    validate={validateForm}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="password">New password:</Label>
          <Field
            id="password"
            name="password"
            type="password"
            component={FormInput}
            className="text-f-sm"
            validate={composeValidators(
              required('Please enter your new password'),
              minLength(3, 'Too short'),
            )}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password_confirm">Confirm new password:</Label>
          <Field
            id="password_confirm"
            name="password_confirm"
            type="password"
            component={FormInput}
            className="text-f-sm"
          />
        </FormGroup>
        <Button
          type="submit"
          color="primary"
          className="text-f-sm w-100 mt-3"
          disabled={submitting}
        >
          Update Password
        </Button>
      </Form>
    )}
  />
}

PasswordForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
