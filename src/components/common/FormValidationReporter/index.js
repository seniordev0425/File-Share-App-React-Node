import React from 'react'
import PropTypes from 'prop-types'
import { FormSpy } from 'react-final-form'

import { trackActivity } from 'utils/analytics'


function FormValidationReporter({ formName }) {
  return <FormSpy
    subscription={{ errors: true, touched: true }}
    render={({ errors, touched }) => {
      if (errors && touched) {
        trackActivity(`Form validation failed on ${formName}`, errors)
      }
      return null
    }}
  />
}

FormValidationReporter.propTypes = {
  formName: PropTypes.string.isRequired,
}

export default FormValidationReporter
