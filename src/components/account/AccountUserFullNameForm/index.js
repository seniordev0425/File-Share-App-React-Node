import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import { Button, Form, FormGroup } from 'reactstrap'

import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
} from 'utils/validation'


export function AccountUserFullNameForm(props) {
  const { initialValues, submitting, onSubmit, onCancel } = props

  return <FinalForm
    initialValues={initialValues}
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <Form inline className="d-sm-flex d-block" onSubmit={handleSubmit}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Field
            name="first_name"
            component={FormInput}
            className="text-f-sm"
            hideValidationErrorText
            placeholder="First name"
            validate={composeValidators(
              required('Please enter your first name'),
            )}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Field
            name="last_name"
            component={FormInput}
            className="text-f-sm"
            hideValidationErrorText
            placeholder="Last name"
            validate={composeValidators(
              required('Please enter your last name'),
            )}
          />
        </FormGroup>
        <div className="d-inline-block d-sm-block">
          <Button type="submit" color="primary" className="text-f-sm" disabled={submitting}>Save Changes</Button>
          {
            onCancel && <Button className="ml-2 text-f-sm" onClick={onCancel}>Cancel</Button>
          }
        </div>
      </Form>
    )}
  />
}

AccountUserFullNameForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default AccountUserFullNameForm
