import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  InputGroup, Input,
  Dropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap'
import ReactDateRangePicker from 'react-daterange-picker'
import 'react-daterange-picker/dist/css/react-calendar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'


export default function DateRangePicker(props) {
  const { onSelectDates, dates } = props
  const [showPicker, setShowPicker] = useState(false)

  const handleSelectDates = dates => {
    onSelectDates(dates)
    setShowPicker(false)
  }

  return <Dropdown isOpen={showPicker} toggle={() => setShowPicker(val => !val)}>
    <DropdownToggle tag="div">
      <InputGroup size="sm" className="mr-4 mb-4 d-flex" style={{ width: '14rem' }}>
        <Input
          type="text"
          className="border-0 text-center bg-f-gray15"
          placeholder="Start date"
          value={(dates && dates.start && dates.start.format('MMM DD')) || ''}
          readOnly
        />
        <div className="d-flex px-1 bg-f-gray15">
          <FontAwesomeIcon icon={faLongArrowAltRight} className="align-self-center text-f-gray10" />
        </div>
        <Input
          type="text"
          className="border-0 text-center bg-f-gray15"
          placeholder="End date"
          value={(dates && dates.end && dates.end.format('MMM DD')) || ''}
          readOnly
        />
      </InputGroup>
    </DropdownToggle>
    <DropdownMenu style={{ width: 635 }}>
      <ReactDateRangePicker
        numberOfCalendars={2}
        onSelect={handleSelectDates}
        value={dates}
      />
    </DropdownMenu>
  </Dropdown>
}

DateRangePicker.propTypes = {
  onSelectDates: PropTypes.func.isRequired,
  dates: PropTypes.object,
}
