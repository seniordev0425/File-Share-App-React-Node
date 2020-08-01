import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import {
  Button, Row, Col, Form,
} from 'reactstrap'
import setFieldData from 'final-form-set-field-data'
import * as Yup from 'yup'

import {
  composeValidators,
  required,
  isEmail,
} from 'utils/validation'
import { asyncValidateEmail, validateYupSchema } from 'utils/asyncValidations'
import FormInput from 'components/common/FormInput'

const validationSchema = Yup.object().shape({
  email_address: Yup.string().test(
    'test_email_address',
    'Provided Email address is not available or acceptable',
    asyncValidateEmail
  )
})

export function AccountUserEmailForm(props) {
  const { className, initialValues, submitting, onSubmit, onCancel } = props

  return <FinalForm
    initialValues={initialValues}
    mutators={{ setFieldData }}
    onSubmit={onSubmit}
    validate={validateYupSchema(validationSchema)}
    validateOnBlur
    render={({ handleSubmit }) => {
      return (
      <Form
        className={className}
        onSubmit={handleSubmit}
      >
        <Row noGutters className="align-items-start">
          <Col sm className="pr-sm-2">
            <Field
              name="email_address"
              component={FormInput}
              className="text-f-sm"
              placeholder="Your email address"
              validate={composeValidators(
                required('Email address is required'),
                isEmail('Please enter valid email address'),
              )}
            />
          </Col>
          <Col xs="auto" className="d-flex ml-sm-0 ml-auto pt-sm-0 pt-3">
            <Button
              type="submit"
              color="primary"
              className="text-f-sm"
              disabled={submitting}
            >
              Update
            </Button>
            {
              onCancel && <Button className="ml-2 text-f-sm" onClick={onCancel}>Cancel</Button>
            }
          </Col>
        </Row>
      </Form>
    )}}
  />
}

AccountUserEmailForm.propTypes = {
  className: PropTypes.string,
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default AccountUserEmailForm
