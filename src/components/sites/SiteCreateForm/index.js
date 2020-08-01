import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Field, FormSpy } from 'react-final-form'
import {
  Row, Col,
  InputGroup, InputGroupAddon, Input, InputGroupText,
  FormGroup, FormFeedback, Label,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import {
  composeValidators,
  required,
  minLength,
  maxLength,
  matchesRegex,
} from 'utils/validation'
import { asyncValidateSiteName, validateYupSchema } from 'utils/asyncValidations'
import WizardForm from 'components/common/WizardForm'
import FormInput from 'components/common/FormInput'


const nameValidationSchema = Yup.object().shape({
  name: Yup.string().test(
    'test_name',
    'Invalid subdomain',
    asyncValidateSiteName
  )
})

const SiteNameInput = ({ input, meta }) => {
  const error = (meta.touched && meta.error) || (meta.data && meta.data.error)
  return <>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText className="px-sm-4 p-0 bg-f-gray14 border-f-gray14 text-f-gray8">
          https://
        </InputGroupText>
      </InputGroupAddon>
      <label htmlFor="siteUrl" className="sr-only">Enter URL</label>
      <Input type="text" {...input} id="siteUrl" />
      <div className="w-100 d-sm-none"></div>
      <InputGroupAddon addonType="append" className="ml-auto">
        <InputGroupText className="px-sm-4 p-0 bg-f-gray14 border-f-gray14 text-f-gray8">
          .imfast.io
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    {
      error && <FormFeedback className="d-block">{error}</FormFeedback>
    }
  </>
}

export default function SiteCreateForm(props) {
  const {
    initialValues, storageList,
    submitting, submitted, onSubmit,
    renderConfirmationPage,
  } = props

  return <WizardForm
    initialValues={initialValues}
    useLastStepForConfirmation
    submitting={submitting}
    submitted={submitted}
    onSubmit={onSubmit}
  >
    {/* Site name */}
    <WizardForm.Step
      render={() => <Row>
        <Col className="mx-auto" style={{ maxWidth: '35rem' }}>
          <h1 className="text-center h4 mb-4">
            Choose a name for your new site
          </h1>
          <p className="text-center mb-5">
            This is just a descriptive name to help you recognize this server in your account. You can change this later.
          </p>
          <div className="mb-4">
            <Field
              name="desc"
              component={FormInput}
              className="mb-0 border-f-gray11"
              placeholder="Example: Tom's Website"
              validate={composeValidators(
                required('Please enter the site name'),
                minLength(3, 'Site name must be at least 3 characters'),
                maxLength(50, 'Site name must be at most 50 characters'),
              )}
            />
          </div>
          <div className="d-flex">
            <Button type="submit" color="primary" className="ml-auto">
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        </Col>
      </Row>}
    />

    {/* Website config */}
    <WizardForm.Step
      validate={values => values.websiteConfig ? {} : { websiteConfig: 'Please choose a configuration.' }}
      render={({ previousPage }) => <Row>
        <Col className="mx-auto" style={{ maxWidth: '45rem' }}>
          <h1 className="h4 mb-4 text-center">How will you use this site?</h1>
          <p className="mb-5 text-center">
            Choose a configuration that best represents how you plan to use this site and we'll
            choose the best default options (you can change these later).
          </p>
          <div className="d-flex flex-column text-left ChooseConfig">
            <FormGroup check className="d-flex align-items-center mb-3">
              <Field
                id="chooseWebsite"
                name="websiteConfig"
                component={FormInput}
                inline
                hideValidationErrorText
                type="radio"
                value="website"
                className="mt-0 ml-n4"
              />
              <Label check className="flex-fill d-flex rounded-lg p-3 text-f-md text-f-gray8 bg-f-gray15" htmlFor="chooseWebsite">
                <div className="mt-2 mr-3 flex-shrink-0 ChooseConfig-website"></div>
                <div className="my-2">
                  <h2 className="my-1 text-f-md">Website</h2>
                  Configure your site to be optimal for hosting HTML and Javascript web pages. Automatically load index.html
                  files in any directory. Perfect for hosting a personal website, landing pages, or your company's home page.
                </div>
              </Label>
            </FormGroup>
            <FormGroup check className="d-flex align-items-center mb-3">
              <Field
                id="chooseFtp"
                name="websiteConfig"
                component={FormInput}
                inline
                hideValidationErrorText
                type="radio"
                value="ftp"
                className="mt-0 ml-n4"
              />
              <Label check className="flex-fill d-flex rounded-lg p-3 text-f-md text-f-gray8 bg-f-gray15" htmlFor="chooseFtp">
                <div className="mt-2 mr-3 flex-shrink-0 ChooseConfig-ftp"></div>
                <div className="my-2">
                  <h2 className="my-1 text-f-md">FTP / File Repository</h2>
                  Configure your site to display browsable folder and file listings automatically. Browse folders by URL.{' '}
                  Host your files on a global CDN making collaboration easy and downloads super-fast.
                </div>
              </Label>
            </FormGroup>
            <FormGroup check className="d-flex align-items-center mb-3">
              <Field
                id="chooseDownloads"
                name="websiteConfig"
                component={FormInput}
                inline
                hideValidationErrorText
                type="radio"
                value="downloads"
                className="mt-0 ml-n4"
              />
              <Label check className="flex-fill d-flex rounded-lg p-3 text-f-md text-f-gray8 bg-f-gray15" htmlFor="chooseDownloads">
                <div className="mt-2 mr-3 flex-shrink-0 ChooseConfig-download"></div>
                <div className="my-2">
                <h2 className="my-1 text-f-md">Downloads</h2>
                Configure your site for optimal performance, privacy, and download speed. Link directly to your files on our
                global network. Insure your downloads are fast no matter where your users are.
                </div>
              </Label>
            </FormGroup>
            <FormGroup className="ml-4">
              <FormSpy
                subscription={{ errors: true, touched: true }}
                render={({ errors, touched }) =>
                  errors.websiteConfig && touched.websiteConfig ? (
                    <FormFeedback valid={false} className="d-block">
                      {errors.websiteConfig}
                    </FormFeedback>
                  ) : null
                }
              />
            </FormGroup>
          </div>
          <div className="d-flex">
            <Button outline color="primary" onClick={previousPage}>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" aria-hidden="true" />
              Back
            </Button>
            <Button type="submit" color="primary" className="ml-auto">
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        </Col>
      </Row>}
    />

    {/* Storage */}
    {
      storageList.size > 1 &&
      <WizardForm.Step
        validate={values => values.storage ? {} : { storage: 'Required' }}
        render={({ previousPage }) => <Row>
          <Col className="text-center mx-auto" style={{ maxWidth: '45rem' }}>
            <h1 className="h4 mb-4">Choose a storage provider for your site</h1>
            <p className="mb-5">
              These are the storage providers you've connected. Add more providers in your <Link
                to="/account/storage"
                className="text-nowrap"
              >
                account settings
              </Link>. Choose one to use for this site:
            </p>
            <div className="d-flex flex-column text-left m-auto" style={{ maxWidth: '20rem' }}>
              <div className="ChooseStorage">
                {
                  storageList.map(storage => (
                    <FormGroup
                      key={storage.name}
                      check
                      className="d-flex align-items-center mb-3"
                    >
                      <Field
                        id={`choose-${storage.name}`}
                        name="storage"
                        component={FormInput}
                        inline
                        hideValidationErrorText
                        type="radio"
                        value={storage.name}
                        className="mt-0 ml-n4"
                      />
                      <Row
                        noGutters
                        tag={Label}
                        className="form-check-label rounded-lg py-1 px-2 w-100 bg-f-gray15"
                        htmlFor={`choose-${storage.name}`}
                      >
                        <Col sm="7" className="d-flex align-items-center m-auto">
                          <div className={`mr-3 flex-shrink-0 ChooseStorage-${storage.name}`} />
                          <h2 className="mb-0 text-f-md">{storage.display}</h2>
                        </Col>
                      </Row>
                    </FormGroup>
                  ))
                }
              </div>
              <div className="d-flex mt-5">
                <Button outline color="primary" onClick={previousPage}>
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" aria-hidden="true" />
                  Back
                </Button>
                <Button type="submit" color="primary" className="ml-auto">
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Col>
        </Row>}
      />
    }

    {/* Site URL */}
    <WizardForm.Step
      initialValueModifier={initialValues => ({
        ...initialValues,
        name: initialValues.desc.toLowerCase().replace(' ', '-').replace(/[^a-z0-9\-_]/g, ''),
      })}
      validate={validateYupSchema(nameValidationSchema)}
      validateOnBlur
      render={({ previousPage, submitting }) => <Row>
        <Col className="mx-auto" style={{ maxWidth: '45rem' }}>
          <h1 className="h4 mb-4 text-center">
            Choose your URL
          </h1>
          <p className="mb-5 text-center">
            Enter a URL that you want your site to be accessed at. You can choose a full custom domain name later (ex: www.yoursite.com).
          </p>
          <div className="d-flex flex-column">
            <div className="form-group mb-4">
              <Field
                name="name"
                component={SiteNameInput}
                validate={composeValidators(
                  required('Please enter the site name'),
                  minLength(3, 'Subdomain must be at least 3 characters'),
                  maxLength(50, 'Subdomain must be at most 50 characters'),
                  matchesRegex(/^[a-zA-Z0-9][a-zA-Z0-9-_]+[a-zA-Z0-9]$/, 'Invalid subdomain'),
                  matchesRegex(/^((?!([-_]{2,})).)*$/, 'Invalid subdomain'),
                )}
              />
              <small
                id="domainHelpBlock"
                className="form-text mt-1 w-100 text-left ChooseURL-helpText text-f-gray8"
              >
                Alphanumeric characters, hyphens, and underscores only. This cannot be changed later.
              </small>
            </div>
          </div>
          <div className="d-flex">
            <Button outline color="primary" onClick={previousPage} disabled={submitting}>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" aria-hidden="true" />
              Back
            </Button>
            <Button type="submit" color="primary" className="ml-auto" disabled={submitting}>
              Create Site
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        </Col>
      </Row>}
    />
    <WizardForm.Step
      render={renderConfirmationPage}
    />
  </WizardForm>
}

SiteCreateForm.propTypes = {
  initialValues: PropTypes.object,
  storageList: ImmutablePropTypes.list.isRequired,
  submitting: PropTypes.bool,
  submitted: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  renderConfirmationPage: PropTypes.func.isRequired,
}
