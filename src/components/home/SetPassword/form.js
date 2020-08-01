import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import {
  Form, FormGroup, Button, Row,
} from 'reactstrap'
import PropTypes from 'prop-types'

import {
  composeValidators,
  required,
  minLength,
} from 'utils/validation'
import FormInput from 'components/common/FormInput'


function PasswordForm(props) {
  const { submitting, onSubmit } = props

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-4">
          <label htmlFor="passwordInput" className="py-5 m-0 font-weight-bold d-block text-center text-f-gray3">
            Add a password to your Fast.io account:
          </label>
          <Field
            id="passwordInput"
            name="password"
            type="password"
            component={FormInput}
            className="mb-0 py-4 border-f-gray11"
            placeholder="Enter password"
            validate={composeValidators(
              required('Please enter your new password'),
              minLength(3, 'Too short'),
            )}
          />
          <Row noGutters className="ml-auto mt-2" style={{ height: 3, width: 80 }}>
            <span aria-live="polite" id="strength" className="sr-only">weak</span>
            <span className="sr-only">
              Strong passwords consist of numeric, alphabetic (uppercase and lowercase) characters in addition to special symbols and similar characters.
            </span>
            <div className="col rounded-sm ml-1 bg-f-color2"></div>
            <div className="col rounded-sm ml-1 bg-f-color2"></div>
            <div className="col rounded-sm ml-1 bg-f-gray13"></div>
            <div className="col rounded-sm ml-1 bg-f-gray13"></div>
          </Row>
        </FormGroup>
        <Button
          type="submit"
          size="lg"
          color="success"
          className="w-100 py-3 text-f-md"
          disabled={submitting}
        >
          Create Account
        </Button>
      </Form>
    )}
  />
}

PasswordForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

export default PasswordForm
