import React from 'react'
import { Link } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, FormGroup, Button } from 'reactstrap'
import PropTypes from 'prop-types'

import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
  isEmail,
  minLength,
  maxLength
} from 'utils/validation'

export default function LoginForm(props) {
  const { initialValues, submitting, onSubmit } = props

  return <FinalForm
    initialValues={initialValues || { username: '', password: '' }}
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-4">
          <label htmlFor="loginEmail" className="sr-only">
            Enter your email address for your Fast.io account
          </label>
          <div className="mb-3">
            <Field
              name="username"
              component={FormInput}
              id="loginEmail"
              type="email"
              className="py-4 mb-2 border-f-gray11"
              placeholder="name@example.com"
              needsFeedback
              validate={composeValidators(
                required('Enter a valid email address'),
                isEmail('Enter a valid email address')
              )}
            />
          </div>
          <label htmlFor="enterPassword" className="sr-only">
            Enter your password
          </label>
        </FormGroup>
        <FormGroup className="mb-4">
          <div className="mb-2">
            <Field
              name="password"
              component={FormInput}
              type="password"
              className="py-4 mb-2 border-f-gray11"
              placeholder="Enter the password"
              needsFeedback
              validate={composeValidators(
                required('Your password must be between 6 and 30 characters in length.'),
                minLength(6, 'Your password must be between 6 and 30 characters in length.'),
                maxLength(30, 'Your password must be between 6 and 30 characters in length.')
              )}
            />
          </div>
          <div className="text-right Login-forgotPassword">
            <Link to="/password/reset" className="text-f-sm">Forgot password?</Link>
          </div>
        </FormGroup>

        <Button
          type="submit"
          color="success"
          size="lg"
          className="w-100 py-3 text-f-md"
          disabled={submitting}
        >
          Log In
        </Button>
      </Form>
    )}
  />
}

LoginForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
