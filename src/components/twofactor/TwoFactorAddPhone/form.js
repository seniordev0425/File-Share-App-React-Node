import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import { Button, Form, FormFeedback, FormGroup } from 'reactstrap'
import setFieldData from 'final-form-set-field-data'
import * as Yup from 'yup'

import { requiredPhoneObj } from 'utils/validation'
import { asyncValidatePhoneObj, validateYupSchema } from 'utils/asyncValidations'
import FormPhoneInput from 'components/common/FormPhoneInput'
import DisabledLink from 'components/common/DisabledLink'


const validationSchema = Yup.object().shape({
  intl_phone_data: Yup.object().test(
    'test_intl_phone_data',
    'Entered phone number is not valid',
    asyncValidatePhoneObj
  )
})

export default function PhoneNumberForm(props) {
  const { submitting, onSubmit } = props
  const [call, setCall] = React.useState(false)

  const handlePhoneReset = data => {
    onSubmit({
      ...data.intl_phone_data,
      call,
    })
  }

  const submitWithCall = (handleSubmit) => ev => {
    ev.preventDefault()
    setCall(true)
    setTimeout(handleSubmit, 0)
  }

  return <FinalForm
    onSubmit={handlePhoneReset}
    mutators={{ setFieldData }}
    validate={validateYupSchema(validationSchema)}
    validateOnBlur
    render={({ handleSubmit }) => (
      <>
        <Form inline className="d-sm-flex d-block" onSubmit={handleSubmit}>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Field
              name="intl_phone_data"
              component={FormPhoneInput}
              className="text-f-sm"
              hideValidationErrorText
              validate={requiredPhoneObj('Please enter your phone number')}
            />
          </FormGroup>
          <FormGroup>
            <Button
              type="submit"
              color="primary"
              className="text-f-sm"
              onClick={() => setCall(false)}
              disabled={submitting}
            >
              Text me
            </Button>
          </FormGroup>
        </Form>
        <FormSpy
          subscription={{ errors: true, touched: true, submitErrors: true }}
          render={({ errors, touched, submitErrors = {} }) => 
            touched.intl_phone_data && (errors.intl_phone_data || submitErrors.intl_phone_data) ? (
              <FormFeedback valid={false} className="d-block">
                {errors.intl_phone_data || submitErrors.intl_phone_data}
              </FormFeedback>
            ) : null
          }
        />

        <div className="text-f-sm mt-3">
          We can also {
            submitting ?
            <DisabledLink>call you instead</DisabledLink> :
            <a href="/" onClick={submitWithCall(handleSubmit)}>call you instead</a>
          }.
        </div>
      </>
    )}
  />
}

PhoneNumberForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
