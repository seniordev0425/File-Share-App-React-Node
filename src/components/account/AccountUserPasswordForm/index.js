import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import { Button, Form, FormGroup, Label } from 'reactstrap'

import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
  minLength,
  maxLength
} from 'utils/validation'


export default class AccountUserPasswordForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
  }

  validateForm = (values) => {
    const errors = {}
    if (values.password !== values.password_confirm) {
      errors.password_confirm = 'Please confirm your password'
    }
    return errors
  }

  handleSubmit = (data) => {
    const { onSubmit } = this.props
    onSubmit({
      password: data.password,
    })
  }

  render() {
    const { initialValues, submitting, onCancel } = this.props

    return <>
      <div className="float-right">
        <a href="/" onClick={onCancel}>Close</a>
      </div>
      <FinalForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validate={this.validateForm}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} style={{ maxWidth: '25rem' }}>
            {/* <FormGroup>
              <Label for="current_password">Current password:</Label>
              <Field
                id="current_password"
                name="current_password"
                type="password"
                component={FormInput}
                className="text-f-sm"
                validate={composeValidators(
                  required('Please enter your current password'),
                )}
              />
            </FormGroup> */}
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
                  minLength(6, 'Too short'),
                  maxLength(30, 'The password must be between 6 and 30 characters in length.')
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
            <Button type="submit" color="primary" className="text-f-sm" disabled={submitting}>Save Password</Button>
            {
              onCancel && <Button className="ml-2 text-f-sm" onClick={onCancel}>Cancel</Button>
            }
          </Form>
        )}
      />
    </>
  }

}
