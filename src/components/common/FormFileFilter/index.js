import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Col,
  FormFeedback,
  Input,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faBan, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import {
  buildRegexPattern,
  cleanupRegex,
  joinRegexPatterns,
  splitRegexPattern
} from 'utils/regex'
import { FILTER_MODE_MAP } from 'constants/common'

const FILTER_LABELS = {
  [FILTER_MODE_MAP.INCLUDE_REGEX]: {
    inputLabel: 'Add an inclusion',
    buttonLabel: 'Include',
    statusLabel: 'Included',
    listTitlePrefix: 'Included',
    statusIcon: faPlusCircle,
    statusIconColor: 'text-f-color2',
  },
  [FILTER_MODE_MAP.NOTHING]: {
    inputLabel: 'Add an exclusion',
    buttonLabel: 'Exclude',
    statusLabel: 'Blocked',
    listTitlePrefix: 'Excluded',
    statusIcon: faBan,
    statusIconColor: 'text-f-color6',
  }
}

const FormFileFilter = ({ input, meta, filterMode, placeholder, listTitle, forPath }) => {
  const [filterText, setFilterText] = useState('')
  const elementId = `${input.name}-id`
  const patterns = splitRegexPattern(input.value)
  const hasValidationError = (meta && meta.touched && meta.error) || (meta && meta.data && meta.data.error)
  const mode = filterMode || FILTER_MODE_MAP.NOTHING
  const disabled = filterMode === FILTER_MODE_MAP.EVERYTHING

  const handleAdd = () => {
    if (filterText) {
      const newPattern = buildRegexPattern(filterText, forPath)
      if (patterns.indexOf(newPattern) === -1) {
        const newPatterns = [...patterns, newPattern]
        input.onChange(joinRegexPatterns(newPatterns))
        setFilterText('')
      }
    }
  }

  const handleRemove = (pattern) => () => {
    const newValue = joinRegexPatterns(patterns.filter(item => item !== pattern))
    input.onChange(newValue)
  }

  return <div className={disabled ? 'fade-item' : undefined} style={disabled ? { pointerEvents: 'none'} : undefined}>
    <Row className="no-gutters align-items-center mb-5 text-f-sm">
      <Col md="auto" htmlFor={elementId} className="mb-md-0 mr-3 text-f-gray3" tag="label">
        {FILTER_LABELS[mode].inputLabel}:
      </Col>
      <Input
        type="text"
        className="col-md px-2 mr-3 mb-md-0 mb-3 text-f-md js-input-exclude"
        id={elementId}
        placeholder={placeholder}
        style={{ maxWidth: '30rem' }}
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
      />
      <Col xs="auto">
        <Button
          type="button"
          color="primary"
          className="px-2 mr-3 text-f-sm js-btn-exclude"
          onClick={handleAdd}
          disabled={disabled}
        >
          {FILTER_LABELS[mode].buttonLabel}
        </Button>
      </Col>
    </Row>
    <h3 className="mb-4 text-f-md">
      {FILTER_LABELS[mode].listTitlePrefix} {listTitle || 'Files'}
    </h3>
    <ListGroup flush className="border-top DataList border-f-gray13">
      {patterns.map((pattern, index) => (
        <ListGroupItem key={index}>
          <Row className="align-items-center">
            <Col md={2} sm={3} className="pl-0 my-2 text-nowrap">
              <FontAwesomeIcon
                icon={FILTER_LABELS[mode].statusIcon}
                className={cn(FILTER_LABELS[mode].statusIconColor, 'mr-2')}
              />
              {FILTER_LABELS[mode].statusLabel}
            </Col>
            <Col xs className="pl-0 pr-4 my-2 js-item-text">{cleanupRegex(pattern)}</Col>
            <Col xs="auto" className="ml-auto my-2 px-0">
              <Button
                outline
                color="primary"
                type="button"
                className="text-f-sm"
                onClick={handleRemove(pattern)}
                disabled={disabled}
              >
                <FontAwesomeIcon icon={faEraser} className="mr-2" />Remove
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      ))}
    </ListGroup>
    {hasValidationError && (
      <FormFeedback valid={false} className="d-block">
        {meta.error || (meta.data && meta.data.error)}
      </FormFeedback>
    )}
    <p className="mt-5 text-f-sm text-f-gray8">
      For more control over file filtering, see the Fast.io{' '}
      <a
        href="https://docs.fast.io/docs/regex"
        className="text-nowrap"
        target="_blank"
        rel="noopener noreferrer">
        API documentation
      </a>
    </p>
  </div>
}

FormFileFilter.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object,
  filterMode: PropTypes.number,
  placeholder: PropTypes.string,
  listTitle: PropTypes.string,
  forPath: PropTypes.bool
}

FormFileFilter.defaultProps = {
  forPath: true
}

export default FormFileFilter
