import React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, FormGroup } from 'reactstrap'

import FormInput from 'components/common/FormInput'


export default function APIKeyForm(props) {
  const { setSubmit, onSubmit } = props

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => {
      setSubmit && setSubmit(handleSubmit)

      return <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Memo: </label>
          <Field
            name="memo"
            component={FormInput}
          />
        </FormGroup>
      </Form>
    }}
  />
}

APIKeyForm.propTypes = {
  setSubmit: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}
