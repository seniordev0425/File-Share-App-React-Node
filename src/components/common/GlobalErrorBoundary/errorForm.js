import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, FormGroup, Button, Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'

import FormInput from 'components/common/FormInput'


function ErrorForm(props) {
  const { error, onCancel, onSubmit } = props

  const handleSubmit = data => onSubmit(data)

  return <FinalForm
    initialValues={{
      errorCode: error.stack,
    }}
    onSubmit={handleSubmit}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FormGroup className="text-left">
          <Field
            name="errorCode"
            type="textarea"
            component={FormInput}
            rows={15}
            className="text-f-sm"
            readOnly
          />
        </FormGroup>

        <div className="mt-5 text-f-sm">
          <Row>
            <Col className="mr-2">
              <Button
                color="primary"
                outline
                className="text-f-sm w-100"
                onClick={onCancel}
              >
                Don't Send
              </Button>
            </Col>
            <Col>
              <Button
                type="submit"
                color="primary"
                className="text-f-sm w-100"
              >
                Send Error Report
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    )}
  />
}

ErrorForm.propTypes = {
  error: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ErrorForm
