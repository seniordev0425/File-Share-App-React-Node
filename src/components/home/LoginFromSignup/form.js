import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { Button, Form, FormGroup, Input } from 'reactstrap'
import PropTypes from 'prop-types'

import FormInput from 'components/common/FormInput'
import { required } from 'utils/validation'


export default function LoginForm({ email, onSubmit }) {
  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-4">
          <label htmlFor="userEmail" className="sr-only">Your email address for this account</label>
          <Input
            id="userEmail"
            type="text"
            name="email"
            value={email}
            className="py-4 mb-3 border-f-gray11"
            disabled
          />
          <label htmlFor="enterPassword" className="sr-only">Enter password for your Fast.io account</label>
          <Field
            id="enterPassword"
            name="password"
            type="password"
            component={FormInput}
            className="mb-0 py-4 border-f-gray11"
            placeholder="Enter password"
            validate={required('Password is required')}
          />
        </FormGroup>
        <Button
          type="submit"
          size="lg"
          color="success"
          className="w-100 py-3 text-f-md"
        >
          Log In
        </Button>
      </Form>
    )}
  />
}

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
