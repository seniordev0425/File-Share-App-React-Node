import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import {
  Button, Row, Col, Form,
} from 'reactstrap'
import setFieldData from 'final-form-set-field-data'
import * as Yup from 'yup'

import { requiredPhoneObj } from 'utils/validation'
import { asyncValidatePhoneObj, validateYupSchema } from 'utils/asyncValidations'
import FormPhoneInput from 'components/common/FormPhoneInput'


const validationSchema = Yup.object().shape({
  intl_phone_data: Yup.object().test(
    'test_intl_phone_data',
    'Entered phone number is not valid',
    asyncValidatePhoneObj
  )
})

export default function AccountUserPhoneForm(props) {
  const { className, initialValues, submitting, onSubmit, onCancel } = props

  const initialValuesForForm = {
    intl_phone_data: {
      phone_country: (initialValues || {}).phone_country || '',
      phone_number: (initialValues || {}).phone_number || '',
    }
  }

  const handleSubmit = (data, form, callback) => {
    if (data.intl_phone_data.phone_number) {
      return onSubmit(data.intl_phone_data, form, callback)
    } else {
      return onSubmit({
        phone_country: '',
        phone_number: '',
      }, form, callback)
    }
  }

  return <FinalForm
    initialValues={initialValuesForForm}
    mutators={{ setFieldData }}
    onSubmit={handleSubmit}
    enableReinitialize={false}
    validate={validateYupSchema(validationSchema)}
    validateOnBlur
    render={({ handleSubmit }) => (
      <Form className={className} onSubmit={handleSubmit}>
        <Row noGutters className="align-items-start">
          <Col sm className="pr-sm-2">
            <Field
              name="intl_phone_data"
              component={FormPhoneInput}
              className="text-f-sm"
              validate={requiredPhoneObj('Please enter your phone number')}
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
    )}
  />
}

AccountUserPhoneForm.propTypes = {
  className: PropTypes.string,
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}
