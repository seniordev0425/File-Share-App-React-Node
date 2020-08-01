import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'

const DateRangePicker = lazy(() => import('./rangePicker'))

function UsageDateRangePicker(props) {
  const { onSelectDates, dates } = props

  return <Suspense fallback={<span />}>
    <DateRangePicker
      onSelectDates={onSelectDates}
      dates={dates}
    />
  </Suspense>
}

UsageDateRangePicker.propTypes = {
  onSelectDates: PropTypes.func.isRequired,
  dates: PropTypes.object,
}

export default UsageDateRangePicker
