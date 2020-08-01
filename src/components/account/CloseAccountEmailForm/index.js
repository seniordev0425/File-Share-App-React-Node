import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Field } from 'react-final-form'
import { Button } from 'reactstrap'

import FormInput from 'components/common/FormInput'
import {
  required,
  matchesValue,
  composeValidators,
} from 'utils/validation'


export default class CloseAccountEmailForm extends Component {

  static propTypes = {
    email: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
  }

  handleSubmit = data => {
    this.props.onSubmit(data)
  }

  render() {
    const { email, onCancel } = this.props

    return <Form
      onSubmit={this.handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            Your Email: <Field
              name="email_address"
              component={FormInput}
              className="text-f-sm"
              validate={composeValidators(
                required('Please enter your email address'),
                matchesValue(email, 'Please enter your email to confirm'),
              )}
            />
          </div>
          <Button type="submit" color="danger" className="text-f-sm mr-2">Close Account</Button>
          <Button className="text-f-sm" onClick={onCancel || (e => e)}>Cancel</Button>
        </form>
      )}
    />
  }

}
