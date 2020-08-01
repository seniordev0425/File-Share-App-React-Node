import React, { Suspense, lazy, useMemo } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { parseDate, formatSize } from 'utils/format'
import Spinner from 'components/common/Spinner'

const Chart = lazy(() => import('./chart'))


function StatsChart(props) {
  const { listData, showTransfers, viewInHours } = props
  const format = viewInHours ? 'HH:mm' : 'MMM DD'

  const transfersData = useMemo(() => {
    if (!listData) {
      return null
    }

    return listData.map(item => ({
      date: parseDate(item.start).format(format),
      transfers: parseInt(item.transfers),
    })).toJS()
  }, [listData, viewInHours])

  const bytesData = useMemo(() => {
    if (!listData) {
      return null
    }

    return listData.map(item => ({
      date: parseDate(item.start).format(format),
      bytes: parseInt(item.bytes),
    })).toJS()
  }, [listData, viewInHours])

  const data = showTransfers ? transfersData : bytesData
  const yKey = showTransfers ? 'transfers' : 'bytes'
  const lineColor = showTransfers ? '#8e6acc' : '#2cd387'
  const lineWidth = '2'
  const fillColor = showTransfers ? 'url(#gradient_purple)' : 'url(#gradient_green)'

  return <Suspense fallback={<Spinner />}>
    {
      data ?
      <Chart
        ratio={35}
        data={data}
        xKey="date"
        yKey={yKey}
        yKeyFormatter={num => formatSize(num, !showTransfers, 1)}
        name={showTransfers ? "Transfers" : "Bytes"}
        lineColor={lineColor}
        lineWidth={lineWidth}
        fillColor={fillColor}
      />
      :
      <Spinner />
    }
  </Suspense>
}

StatsChart.propTypes = {
  listData: ImmutablePropTypes.list,
  showTransfers: PropTypes.bool,
  viewInHours: PropTypes.bool,
}

export default StatsChart
