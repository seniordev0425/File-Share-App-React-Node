import React, { Suspense, lazy, useMemo } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

const Chart = lazy(() => import('./chart'))


function StatsMiniChart(props) {
  const { listData } = props

  const data = useMemo(() => {
    if (!listData) {
      return null
    }

    return listData.map((item, index) => ({
      index: index.toString(),
      value: item.bytes,
    })).toJS()
  }, [listData])

  return <Suspense fallback={<span />}>
    {
      data && <Chart
        ratio={25}
        data={data}
        yKey="value"
        lineColor="#8e6acc"
      />
    }
  </Suspense>
}

StatsMiniChart.propTypes = {
  listData: ImmutablePropTypes.list,
}

export default StatsMiniChart
