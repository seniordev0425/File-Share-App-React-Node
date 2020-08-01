import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import {
  Row, Col, Button,
  FormGroup, Label,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import WizardForm from 'components/common/WizardForm'
import FormInput from 'components/common/FormInput'
import {
  composeValidators,
  required,
  minLength,
  maxLength,
} from 'utils/validation'


function AnalyticsProfileCreateForm(props) {
  const {
    initialValues, submitting, submitted, onSubmit, renderConfirmationPage,
  } = props

  return <WizardForm
    initialValues={initialValues}
    useLastStepForConfirmation
    submitting={submitting}
    submitted={submitted}
    onSubmit={onSubmit}
  >
    <WizardForm.Step
      render={() => <Row>
        <Col className="text-center mx-auto" style={{ maxWidth: '35rem' }}>
          <h1 className="h4 mb-5">Name your Google Analytics profile</h1>
          <div className="d-flex flex-column">
            <FormGroup className="mb-4">
              <Label htmlFor="chooseProfileName" className="sr-only">New profile name</Label>
              <Field
                name="name"
                component={FormInput}
                id="chooseProfileName"
                className="mb-0 border-f-gray11"
                placeholder="Example: Tom's Analytics"
                validate={composeValidators(
                  required('Please enter the profile name'),
                  minLength(3, 'Profile name must be at least 3 characters'),
                  maxLength(30, 'Profile name must be at most 30 characters'),
                )}
              />
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              className="ml-auto"
            >
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </Col>
      </Row>}
    />
    <WizardForm.Step
      render={() => <Row>
        <Col className="text-center mx-auto" style={{ maxWidth: '35rem' }}>
          <h1 className="h4 mb-5">Google Analytics Tracking ID</h1>
          <div className="d-flex flex-column mb-5">
            <FormGroup className="mb-4 text-left">
              <Label htmlFor="enterTrackingID" className="small">Tracking ID for “Tom's Analytics”</Label>
              <Field
                name="token"
                component={FormInput}
                id="enterTrackingID"
                className="mb-0 border-f-gray11"
                placeholder="UA-xxxxxxxx-x"
                validate={composeValidators(
                  required('Please enter the tracking ID'),
                  minLength(3, 'Tracking ID must be at least 3 characters'),
                  maxLength(40, 'Tracking ID must be at most 40 characters'),
                )}
              />
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              className="ml-auto"
              disabled={submitting}
            >
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
          <div className="rounded shadow">
            <div className="bg-white p-3 rounded-top text-left border border-bottom-0 border-f-gray13">
              {/* TODO: replace with real URL */}
              <a href="/" className="text-f-md">
                <FontAwesomeIcon icon={faQuestionCircle} size="lg" className="mr-2" />
                How to get your tracking ID
              </a>
            </div>
            <div className="embed-responsive embed-responsive-16by9 rounded-bottom">
              <iframe
                className="embed-responsive-item"
                src="https://www.youtube.com/embed/wtMY_YjpjAc"
                allowFullScreen=""
                title="How to get your tracking ID"
              />
            </div>
          </div>
        </Col>
      </Row>}
    />
    <WizardForm.Step
      render={renderConfirmationPage}
    />
  </WizardForm>
}

AnalyticsProfileCreateForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  submitted: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  renderConfirmationPage: PropTypes.func.isRequired,
}

export default AnalyticsProfileCreateForm
