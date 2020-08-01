import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import { Button, Form, FormGroup } from 'reactstrap'

import FormInput from 'components/common/FormInput'
import { required } from 'utils/validation'


export default function TwoFactorCodeForm(props) {
  const { onSubmit, onResend } = props

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <Form inline onSubmit={handleSubmit}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 flex-grow-1" style={{ maxWidth: '15rem' }}>
          <Field
            name="code"
            component={FormInput}
            className="text-f-sm w-100"
            hideValidationErrorText
            validate={required('2FA verification code is required')}
          />
        </FormGroup>
        <FormGroup>
          <Button
            type="submit"
            color="primary"
            className="text-f-sm"
          >
            Verify
          </Button>
        </FormGroup>
        {
          onResend && <FormGroup>
            <Button
              color="link"
              className="text-f-sm ml-2"
              onClick={onResend}
            >
              Re-send code
            </Button>
          </FormGroup>
        }
      </Form>
    )}
  />
}

TwoFactorCodeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onResend: PropTypes.func,
}
