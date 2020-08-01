import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import {
  Form, FormGroup, Button, Col,
} from 'reactstrap'
import PropTypes from 'prop-types'

import {
  composeValidators,
  required,
} from 'utils/validation'
import FormInput from 'components/common/FormInput'


function TwoFactorCodeForm(props) {
  const { submitting, onSubmit } = props

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit} className="mb-3">
        <div className="form-row justify-content-center">
          <FormGroup className="col-sm-5 m-0">
            <label htmlFor="appCode" className="sr-only">
              Enter code
            </label>
            <Field
              id="appCode"
              name="code"
              component={FormInput}
              className="py-4 mb-sm-0 mb-4 text-center border-f-gray11"
              placeholder="Code"
              hideValidationErrorText
              validate={composeValidators(
                required('Please enter the code'),
              )}
            />
          </FormGroup>
          <Col sm="3" className="flex-grow-0">
            <Button
              type="submit"
              size="lg"
              color="success"
              className="py-sm-0 py-3 h-100 w-100 text-f-md"
              disabled={submitting}
            >
              Verify
            </Button>
          </Col>
        </div>
      </Form>
    )}
  />
}

TwoFactorCodeForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

export default TwoFactorCodeForm
