import React from 'react'
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Button, Col, FormGroup, Row
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faGlobe, faTimes, faInfoCircle, faLock, faExclamationTriangle, faToggleOff, faTrash, faCog
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import diff from 'object-diff'

import DetailBlock from 'components/common/DetailBlock'
import FormCachingTime from 'components/common/FormCachingTime'
import FormInput from 'components/common/FormInput'
import FormFileFilter from 'components/common/FormFileFilter'
import FormSwitch from 'components/common/FormSwitch'
import TogglingInputField from 'components/common/TogglingInputField'
import Tooltip from 'components/common/Tooltip'
import FormValidationReporter from 'components/common/FormValidationReporter'
import TFAMark from 'components/common/TFAMark'
import {
  DEFAULT_EXCLUDE_FILTER_REGEX,
  FILTER_MODE_MAP,
  FILTER_MODE_OPTIONS
} from 'constants/common'
import { getIconForStorage } from 'utils/icons'
import { usePreviousValue } from 'utils/hooks'
import {
  composeValidators,
  minLength,
  maxLength,
} from 'utils/validation'

const defaultInitialValues = {
  desc: '',
  fancyindexing: false,
  indexfiles: false,
  search: false,
  autoupdate: false,
  precache: false,
  precachedata: false,
  storage: '',
  password: '',
  expires: 0,
  minify_html: false,
  minify_js: false,
  minify_css: false,
  rocket_load: false,
  image_mirage: false,
  image_polish: false,
  email_obfs: false,
  scrape_shield: false,
  filter: '',
  filter_mode: 0,
}

const filterRequired = (value, { filter_mode }) =>
  filter_mode === FILTER_MODE_MAP.EVERYTHING || value
  ? undefined
  : 'At least one filter is required'

const cleanInitialValues = (props) => {
  const cleanedInitialValues = {}
  Object.keys(defaultInitialValues).forEach(prop => {
    cleanedInitialValues[prop] = (props.initialValues || {})[prop] || defaultInitialValues[prop]
  })
  return cleanedInitialValues
}

const SiteSettingsFormInner = (props) => {
  const {
    initialValues,
    user,
    plan,
    storageList,
    submitting,
    onSubmit,
    onToggleDisable,
    onPermanentlyDelete,
    formProps,
  } = props
  const { dirty, handleSubmit, form } = formProps

  const isFreePlan = !plan || plan.free

  const filterMode = form.getState().values.filter_mode

  const handleRemovePassword = () => {
    onSubmit({
      password: ''
    })
  }

  const handleAddPassword = (form) => () => {
    if (form.getState().errors.password) {
      return
    }
    onSubmit({
      password: form.getState().values.password
    })
  }

  usePreviousValue(filterMode, prev => {
    if (filterMode === FILTER_MODE_MAP.NOTHING) {
      form.change('filter', DEFAULT_EXCLUDE_FILTER_REGEX)
    } else if (filterMode === FILTER_MODE_MAP.INCLUDE_REGEX) {
      form.change('filter', '')
    } else {
      form.change('filter', initialValues.filter)
    }
  })

  const storage = storageList.find(storage => storage.name === initialValues.storage)

  return (
    <form className="pt-3 pb-5 px-sm-3 px-0 mt-2 bg-f-gray15" onSubmit={handleSubmit}>
      <Row className="no-gutters EditSite-settingsRow">
        <Col lg className="p-3 position-relative">
          <DetailBlock header="Settings" className="h-100 EditSite-settings text-f-sm text-f-gray8">
            <Row className="py-2">
              <Col xl={4} lg={3} className="py-2">Site name:</Col>
              <Col className="d-flex py-2 align-items-center">
                <span className="d-inline-block flex-shrink-0 mr-2 text-center" style={{ width: 30 }}>
                  <FontAwesomeIcon icon={faGlobe} size="lg" className="text-f-gray8" />
                </span>
                <Field name="desc" render={({ input }) => (
                  <TogglingInputField
                    {...input}
                    editButtonText="Rename"
                  />
                )} />
              </Col>
            </Row>
            <Row className="py-2">
              <Col xl={4} lg={3} className="py-2">Syncs from:</Col>
              <Col className="d-flex py-2">
                <span className="d-inline-block flex-shrink-0 mr-2 text-center" style={{ width: 30 }}>
                  <FontAwesomeIcon icon={getIconForStorage(initialValues.storage)} size="lg" />
                </span>
                <span>
                  <Field name="storage" render={({ input }) => (
                    <TogglingInputField
                      {...input}
                      type="select"
                      editButtonText="Change"
                      displayValue={storage ? storage.display : null}
                    >
                      {
                        storageList.map(storage => (
                          <option
                            key={storage.id}
                            value={storage.name}
                          >
                            {storage.display}
                          </option>
                        ))
                      }
                    </TogglingInputField>
                  )} />
                </span>
              </Col>
            </Row>
          </DetailBlock>
        </Col>

        <Col lg className="p-3 position-relative">
          <DetailBlock header="Customization" className="h-100 EditSite-customization text-f-sm text-f-gray8">
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col xl={5} lg={3} xs="auto" className="py-2 m-0 mr-auto" tag="label">
                  Generate folder listings:
                </Col>
                <Field
                  name="fancyindexing"
                  type="checkbox"
                  component={FormSwitch}
                  caption="On"
                  className="col-md col-auto py-2 ml-3"
                />
              </Row>
            </FormGroup>
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col xl={5} lg={3} xs="auto" className="py-2 m-0 mr-auto" tag="label">
                  Show index files:
                </Col>
                <Field
                  name="indexfiles"
                  type="checkbox"
                  component={FormSwitch}
                  caption="On"
                  className="col-md col-auto py-2 ml-3"
                />
              </Row>
            </FormGroup>
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                  Custom 404
                  <Tooltip
                    placement="top"
                    tooltip="As a Fast Premium customer, you can set a custom 404 error page to be displayed anytime someone accesses a URL on your site that doesn't exist.">
                    <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" />
                  </Tooltip>
                  {' : '}
                  <span
                    className="text-white text-uppercase text-nowrap font-weight-bold rounded-pill px-2 py-1 ml-2 FastProBadge"
                    style={{ fontSize: '0.5rem' }}>
                    Fast Premium
                  </span>
                </Col>
                <Col xl={12} className="d-sm-flex py-2">
                  <input type="text" className="form-control mr-3 mb-sm-0 mb-3 text-f-md" id="custom404" value="Default Fast.io 404 page" readOnly />
                  <a href="/app/site/custom404" className="btn btn-primary text-f-sm disabled">Select</a>
                </Col>
              </Row>
            </FormGroup>
          </DetailBlock>
        </Col>
      </Row>

      <Row className="no-gutters EditSite-password_searchRow">
        <Col lg className="p-3 h-100 position-relative">
          <DetailBlock
            header={<>
              <span className="mr-2">Password Protect Site</span>
              <span
                className="text-white text-uppercase text-nowrap font-weight-bold rounded-pill px-2 py-1 my-sm-n2 my-2 FastProBadge"
                style={{ fontSize: '0.5rem' }}>
                Fast Premium
              </span>
            </>}
            headerClassName="flex-wrap align-items-center mb-4"
          >
            <p className="mb-4 text-f-gray6 text-f-md">
              Control access to your site by requiring a password to load any resource.{' '}
              {isFreePlan && <>
                This feature is available to Pro and Business accounts.{' '}
                <Link to="/account/billing">Upgrade now</Link>
              </>}
            </p>
            {initialValues.password ? (
              <div className="d-flex flex-wrap align-items-center">
                <span className="mr-xl-auto pr-4 text-f-md text-f-color2">
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  Password protection: On
                </span>
                <Button
                  type="button"
                  color="danger"
                  size="sm"
                  className="flex-shrink-0 my-2 text-f-sm"
                  onClick={handleRemovePassword}
                >
                  Remove Password
                </Button>
              </div>
            ) : (
              <div className="d-sm-flex align-items-start">
                <div className="d-flex flex-column flex-grow-1 mr-3 mb-3">
                  <Field
                    name="password"
                    type="password"
                    component={FormInput}
                    inline
                    className="text-f-md"
                    placeholder="Password"
                    disabled={isFreePlan}
                    validate={composeValidators(
                      minLength(3, 'Password should be least 3 characters'),
                      maxLength(30, 'Password should be be at most 20 characters'),
                    )}
                  />
                </div>
                <Button
                  type="button"
                  color="primary"
                  className="flex-shrink-0 text-f-sm"
                  disabled={isFreePlan}
                  onClick={handleAddPassword(form)}
                >
                  Add a Password
                </Button>
              </div>
            )}
          </DetailBlock>
        </Col>
        <Col lg className="p-3">
          <DetailBlock header="Search Settings" className="EditSite-search text-f-sm text-f-gray8 h-100">
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col xl={5} xs="auto" className="py-2 m-0" tag="label">
                  Search indexable:
                </Col>
                <Field
                  name="search"
                  type="checkbox"
                  component={FormSwitch}
                  caption="On"
                  className="col py-2 mx-3"
                />
              </Row>
            </FormGroup>
          </DetailBlock>
        </Col>
      </Row>

      <div className="p-3 EditSite-performance text-f-sm text-f-gray8">
        <DetailBlock header="Performance & Security">
          <FormGroup className="mb-3">
            <Field
              label={<>
                Browser caching{' '}
                <Tooltip
                  placement="top"
                  tooltip="Store content in the browser to reduce load time after the first load.">
                  <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" />
                </Tooltip>
              </>}
              name="expires"
              type="checkbox"
              component={FormCachingTime}
              className="col-auto py-2 ml-3"
              caption="On"
            />
          </FormGroup>
          <Row className="row no-gutters pb-3">
            <Col className="col-md pr-md-4">
              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Auto minify HTML{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Remove all unnecessary characters from HTML.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="minify_html"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Auto minify JS{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Remove all unnecessary characters from JS.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="minify_js"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Auto minify CSS{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Remove all unnecessary characters from CSS.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="minify_css"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Rocket Loader{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Prioritize your website's content (text, images, fonts etc) by deferring
                      the loading of all of your JavaScript until after rendering.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="rocket_load"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>
            </Col>

            <Col md className="pl-md-4">
              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Mirage{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Help speed up loading of images depending on the type of device they're being loaded on.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="image_mirage"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Polish{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Strips metadata and compresses your images for faster page load times.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="image_polish"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Email obfuscation{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Email addresses on your web page will be obfuscated (hidden) from bots,
                      while keeping them visible to humans.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="email_obfs"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>

              <FormGroup className="m-0 border-bottom border-f-gray13">
                <Row className="align-items-center py-2">
                  <Col xs="auto" className="py-2 m-0 mr-auto" tag="label">
                    Scrape Shield{' '}
                    <Tooltip
                      placement="top"
                      tooltip="Protect your site against content scraping.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" /> :
                    </Tooltip>
                  </Col>
                  <Field
                    name="scrape_shield"
                    type="checkbox"
                    component={FormSwitch}
                    className="col-auto py-2 ml-3"
                    caption="On"
                  />
                </Row>
              </FormGroup>
            </Col>
          </Row>
        </DetailBlock>
      </div>

      <h1 className="my-4 mr-3 BlockSeparatorHeading">
        <span>
          Advanced Options
          <FontAwesomeIcon icon={faCog} className="ml-2" />
        </span>
      </h1>

      <div className="p-3 EditSite-exclusions">
        <DetailBlock
          noHeaderWrap
          header={
            <div className="d-flex flex-wrap align-items-center pb-sm-2 pb-4 px-4 mb-4 mt-n3 border-bottom DetailBlock-heading border-f-gray15">
              <h2 className="h6 mr-auto mb-0 py-3 pr-5">File Exclusions</h2>
              <div className="w-100 d-sm-none d-block" />
              <div className="form-group mb-0">
                <Row className="align-items-center py-2">
                  <Col xs="auto" htmlFor="filter_mode-id" className="py-2 m-0 text-f-md text-f-gray8" tag="label">
                    Filter mode
                    <Tooltip
                      placement="top"
                      tooltip="Filter mode allows you to choose between filtering out specific files from your site (Exclude),
                      filtering in only selected file (Include) or disable the filter all together.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" />
                    </Tooltip> :
                  </Col>
                  <Field
                    name="filter_mode"
                    id="filter_mode-id"
                    component={FormInput}
                    type="select"
                    inline
                    className="col mx-3 text-f-md"
                    style={{ minWidth: '8rem' }}
                    parse={Number}
                  >
                    {FILTER_MODE_OPTIONS.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </Field>
                </Row>
              </div>
            </div>
          }
        >
          <p className="mb-4 text-f-gray6 text-f-md" style={{ maxWidth: '50rem' }}>
            Automatically exclude files from your site  By default,
            some files that are typically hidden by your operating system will not be served and will be hidden by Fast.io.
            <a href="/">Learn more.</a>
          </p>
          <Field
            name="filter"
            component={FormFileFilter}
            parse={null}
            placeholder="*.git"
            filterMode={filterMode}
            validate={filterRequired}
          />
        </DetailBlock>
      </div>

      <div className="p-3 EditSite-syncing text-f-sm text-f-gray8">
        <DetailBlock header="Syncing" className="h-100">
          <FormGroup className="m-0">
            <Row className="row align-items-center py-2">
              <Col md={5} xs="auto" className="py-2 m-0 mr-auto">
                Automatic sync from{' '}
                <span className="text-capitalize">{initialValues.storage}</span>:
              </Col>
              <Field
                name="autoupdate"
                type="checkbox"
                component={FormSwitch}
                caption="On"
                className="col-md col-auto py-2 ml-3"
              />
            </Row>
          </FormGroup>
          <FormGroup className="m-0">
            <Row className="align-items-center py-2">
              <Col md={5} xs="auto" className="py-2 m-0 mr-auto">
                Automatic push to CDN:
              </Col>
              <Field
                name="precache"
                type="checkbox"
                component={FormSwitch}
                caption="On"
                className="col-md col-auto py-2 ml-3"
              />
              <Col className="d-flex py-2">
                <span className="mr-3 text-nowrap">With data</span>
                <Field
                  name="precachedata"
                  type="checkbox"
                  disabled={!form.getState().values.precache}
                  component={FormSwitch}
                  caption="On"
                />
              </Col>
            </Row>
          </FormGroup>
        </DetailBlock>
      </div>

      <div className="p-3 EditSite-dangerZone text-f-md">
        <DetailBlock
          header={<>
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-f-color4" />
            Owner Settings: Danger Below!
          </>}
        >
            <Row>
              <Col xl className="mb-xl-0 mb-4">
                <div
                  className={cn(
                    'd-flex flex-wrap align-items-center px-3 py-2 font-weight-bold rounded-lg', {
                      'bg-f-color4-light': initialValues.enabled,
                      'bg-f-color2-light': !initialValues.enabled
                    })}>
                  <div className="mr-auto my-2 pr-3">
                    <FontAwesomeIcon icon={faToggleOff} className="mr-3" />
                    {initialValues.enabled ? 'Disable' : 'Enable'} this site
                  </div>
                  <Button
                    type="button"
                    color={initialValues.enabled ? 'warning' : 'success'}
                    className="my-2 text-f-sm js-disable"
                    onClick={onToggleDisable}
                  >
                    {initialValues.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </Col>
              <Col xl>
                <div className="d-flex flex-wrap align-items-center px-3 py-2 font-weight-bold rounded-lg bg-f-color6-light text-f-color6">
                  <div className="mr-auto my-2 pr-3">
                    <FontAwesomeIcon icon={faTrash} className="mr-3" />Permanently delete this site
                  </div>
                  <Button
                    type="button"
                    color="danger"
                    className="my-2 text-f-sm js-permanently-delete"
                    onClick={onPermanentlyDelete}
                  >
                    Permanently Delete
                    <TFAMark
                      show={user && user['2factor']}
                      style={{ verticalAlign: '5%' }}
                    />
                  </Button>
                </div>
              </Col>
            </Row>
        </DetailBlock>
      </div>

      <div className="p-4" />

      {dirty && (
        <section className="js-green-bar">
          <div className="p-2 fixed-bottom text-center bg-f-color2">
            <Button type="button" color="light" outline onClick={form.reset} disabled={submitting} className="m-2">
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Discard Changes
            </Button>
            <Button type="submit" disabled={submitting} color="light" className="m-2 text-f-color2">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              {submitting ? 'Saving Changes...' : 'Apply Changes'}
            </Button>
          </div>
        </section>
      )}

      <FormValidationReporter formName="SiteSettingsForm" />
    </form>
  )
}

export function SiteSettingsForm(props) {
  const { onSubmit } = props
  const initialValues = cleanInitialValues(props)

  const handleSubmit = data => {
    const dataToSubmit = diff(initialValues, data)
    if (Object.keys(dataToSubmit).length > 0) {
      onSubmit(dataToSubmit)
    }
  }

  return <Form
    initialValues={initialValues}
    onSubmit={handleSubmit}
    render={(formProps) => <SiteSettingsFormInner formProps={formProps} {...props} />}
  />
}

SiteSettingsForm.propTypes = {
  initialValues: PropTypes.object,
  user: ImmutablePropTypes.record,
  plan: ImmutablePropTypes.record,
  storageList: ImmutablePropTypes.list.isRequired,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onToggleDisable: PropTypes.func.isRequired,
  onPermanentlyDelete: PropTypes.func.isRequired,
}

export default SiteSettingsForm
