import React, { useState } from 'react'
import { Col, Input, Row } from 'reactstrap'

const secondsOfUnits = {
  'days': 86400,
  'hours': 3600,
  'minutes': 60,
  'seconds': 1
}

const getProperTimeUnit = (seconds) => {
  for (const unit in secondsOfUnits) {
    if (seconds / secondsOfUnits[unit] > 0 && seconds % secondsOfUnits[unit] === 0) {
      return unit
    }
  }
  return 'seconds'
}

const FormCachingTime = ({ input, label }) => {
  const [unit, setUnit] = useState(getProperTimeUnit(input.value))

  const handleChange = (event) => {
    input.onChange(event.target.value * secondsOfUnits[unit])
  }

  const handleBlur = (event) => {
    input.onBlur(event.target.value * secondsOfUnits[unit])
  }

  return (
    <Row className="align-items-center py-2">
      <Col sm="auto" htmlFor={`${input.name}-id`} className="py-2 m-0" tag="label">
        {label} :
      </Col>
      <Input
        className="col ml-3 text-f-md"
        type="number"
        id={`${input.name}-id`}
        placeholder="Time to cache"
        min={0}
        name={input.name}
        value={input.value / secondsOfUnits[unit]}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ maxWidth: '12rem' }}
      />
      <label htmlFor={`${input.name}-units-id`} className="sr-only">Unit of time:</label>
      <Input
        className="col mx-3 text-f-md text-capitalize"
        type="select"
        id={`${input.name}-units-id`}
        style={{ maxWidth: '12rem' }}
        value={unit}
        onChange={event => setUnit(event.target.value)}
      >
        {Object.keys(secondsOfUnits).map(unit => (
          <option value={unit} key={unit}>{unit}</option>
        ))}
      </Input>
    </Row>
  )
}

export default FormCachingTime
