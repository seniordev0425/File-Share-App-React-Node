import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col, Button,
  Form, FormGroup,
} from 'reactstrap'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes, faCheck, faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import Tooltip from 'components/common/Tooltip'

import { parseDate } from 'utils/format'
import DetailBlock from 'components/common/DetailBlock'
import FormInput from 'components/common/FormInput'
import FormFileFilter from 'components/common/FormFileFilter'
import FormSwitch from 'components/common/FormSwitch'
import TogglingInputField from 'components/common/TogglingInputField'
import FormValidationReporter from 'components/common/FormValidationReporter'
import {
  DEFAULT_EXCLUDE_FILTER_REGEX,
  FILTER_MODE_MAP,
  FILTER_MODE_OPTIONS
} from 'constants/common'
import { usePreviousValue } from 'utils/hooks'
import './form.css'


const filterRequired = (value, { filter_mode }) =>
  filter_mode === FILTER_MODE_MAP.EVERYTHING || value
  ? undefined
  : 'At least one filter is required'

const filterCountryRequired = (value, { filter_mode_country }) =>
  filter_mode_country === FILTER_MODE_MAP.EVERYTHING || value
  ? undefined
  : 'At least one filter is required'

function AnalyticsProfileDetailFormInner(props) {
  const {
    provider, profile, submitting, formProps
  } = props
  const { dirty, form, handleSubmit, initialValues } = formProps

  const { filter_mode: filterMode, filter_mode_country: filterModeCountry } = form.getState().values

  usePreviousValue(filterMode, prev => {
    if (filterMode === FILTER_MODE_MAP.NOTHING) {
      form.change('filter', DEFAULT_EXCLUDE_FILTER_REGEX)
    } else if (filterMode === FILTER_MODE_MAP.INCLUDE_REGEX) {
      form.change('filter', '')
    } else {
      form.change('filter', initialValues.filter)
    }
  })

  return (
    <Form onSubmit={handleSubmit}>
      <Row noGutters className="Profile-settingsRow">
        <Col md="6" className="p-3">
          <DetailBlock className="h-100 Profile-settings" header="Settings">
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col tag="label" lg="4" htmlFor="profileName" className="py-2 m-0">Profile name:</Col>
                {/*<Col className="mx-3 p-0">
                  <Field name="name" render={({ input }) => (
                    <TogglingInputField
                      {...input}
                      editButtonText="Rename"
                    />
                  )} />
                </Col>*/}
                <Col tag="span" className="py-2">{profile.name}</Col>
              </Row>
            </FormGroup>
            {/* TODO: enable when API supports */}
            {/* <Row className={cx('py-2', { 'fade-item': editing })}>
              <Col tag="span" lg="4" className="py-2">Owned by:</Col>
              <Col tag="span" className="py-2">Thomas Langridge</Col>
            </Row> */}
            <Row className="py-2">
              <Col tag="span" lg="4" className="py-2">Provider:</Col>
              <Col tag="span" className="py-2">
                {
                  provider && provider.display
                }
              </Col>
            </Row>
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col tag="label" lg="4" htmlFor="profileToken" className="py-2 m-0">Tracking ID:</Col>
                <Col className="mx-3 p-0 js-token-col">
                  <Field name="token" render={({ input }) => (
                    <TogglingInputField
                      {...input}
                      editButtonText="Change"
                    />
                  )} />
                </Col>
              </Row>
            </FormGroup>
            <Row className="py-2">
              <Col tag="span" lg="4" className="py-2">Last updated:</Col>
              <Col tag="span" className="py-2">{parseDate(profile.updated).format('MMM D, YYYY')}</Col>
            </Row>
          </DetailBlock>
        </Col>

        <Col md="6" className="p-3">
          <DetailBlock className="h-100 Profile-customization" header="Customization">
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col tag="label" lg="4" htmlFor="profileEventName" className="py-2 m-0">Event name:</Col>
                <Col className="mx-3 p-0">
                  <Field
                    id="profileEventName"
                    name="event_name"
                    render={({ input }) => (
                      <TogglingInputField
                        {...input}
                        editButtonText="Change"
                      />
                    )}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup className="m-0">
              <Row className="align-items-center py-2">
                <Col tag="label" lg="4" className="py-2 m-0">Report referrer:</Col>
                <Col className="mx-3 p-0 py-2">
                  <Field
                    name="referrer"
                    type="checkbox"
                    component={FormSwitch}
                  />
                </Col>
              </Row>
            </FormGroup>
          </DetailBlock>
        </Col>
      </Row>

      <div className="p-3 Profile-fileFilter">
        <DetailBlock
          noHeaderWrap
          header={
            <div className="d-flex flex-wrap align-items-center pb-sm-2 pb-4 px-4 mb-4 mt-n3 border-bottom DetailBlock-heading border-f-gray15">
              <h2 className="h6 mr-auto mb-0 py-3 pr-5">File Filter</h2>
              <div className="w-100 d-sm-none d-block" />
              <div className="form-group mb-0">
                <Row className="align-items-center py-2">
                  <Col xs="auto" htmlFor="filter_mode-id" className="py-2 m-0 text-f-md text-f-gray8" tag="label">
                    Filter mode
                    <Tooltip
                      placement="top"
                      tooltip="Filter mode allows you to choose between filtering out specific files from being reported to analytics (Exclude),
                      filtering in only selected files to report to analytics (Include) or disable the filter all together.">
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
            Automatically exclude or include files from being reported to analytics.{' '}
            <a href="https://en.wikipedia.org/wiki/Wildcard_character"
              target="_blank" className="text-nowrap" rel="noopener noreferrer">
              Wildcard characters
            </a> are supported.
          </p>
          <Field
            name="filter"
            component={FormFileFilter}
            parse={null}
            placeholder="Example: *.png"
            filterMode={filterMode}
            validate={filterRequired}
          />
        </DetailBlock>
      </div>

      <div className="p-3 Profile-countryFilter">
        <DetailBlock
          noHeaderWrap
          header={
            <div className="d-flex flex-wrap align-items-center pb-sm-2 pb-4 px-4 mb-4 mt-n3 border-bottom DetailBlock-heading border-f-gray15">
              <h2 className="h6 mr-auto mb-0 py-3 pr-5">Country Filter</h2>
              <div className="w-100 d-sm-none d-block" />
              <div className="form-group mb-0">
                <Row className="align-items-center py-2">
                  <Col xs="auto" htmlFor="filter_mode-id" className="py-2 m-0 text-f-md text-f-gray8" tag="label">
                    Filter mode
                    <Tooltip
                      placement="top"
                      tooltip="Filter mode allows you to choose between filtering out specific countries from being reported to analytics (Exclude),
                      filtering in only selected countries to report to analytics (Include) or disable the filter all together.">
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-f-gray10" />
                    </Tooltip> :
                  </Col>
                  <Field
                    name="filter_mode_country"
                    id="filter_mode_country-id"
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
            Automatically exclude or include specific countries from reporting to your analytics.{' '}
            Enter the ISO-3166-1 Alpha-2 codes for the country you want to filter.{' '}
            Each country is identified by 2 Latin digits and is not case sensitive.
            <a href="https://countrycode.org/" target="_blank" className="text-nowrap" rel="noopener noreferrer">
              Learn more
            </a>
          </p>
          <Field
            name="filter_country"
            component={FormFileFilter}
            parse={null}
            forPath={false}
            placeholder="Example: US"
            validate={filterCountryRequired}
            filterMode={filterModeCountry}
          />
        </DetailBlock>
      </div>

      <section>
        <div className={cx(
          'p-2 fixed-bottom text-center bg-f-color2',
          'slide-down',
          {
            'in': dirty,
          }
        )}>
          <Button outline color="light" className="m-2" onClick={form.reset} disabled={submitting}>
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Discard Changes
          </Button>
          <Button type="submit" color="light" className="m-2 text-f-color2" disabled={submitting}>
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </section>

      <FormValidationReporter formName="AnalyticsProfileDetailForm" />
    </Form>
  )
}

function AnalyticsProfileDetailForm(props) {
  const { onSubmit, profile } = props
  const handleSubmit = data => onSubmit(data)
  const { name, ...initialValues } = profile.toJS()
  return (
    <FinalForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(formProps) => (
        <AnalyticsProfileDetailFormInner {...props} formProps={formProps} />
      )}
    />
  )
}

AnalyticsProfileDetailForm.propTypes = {
  provider: ImmutablePropTypes.record,
  profile: ImmutablePropTypes.record.isRequired,
  editing: PropTypes.bool,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
}

export default AnalyticsProfileDetailForm
