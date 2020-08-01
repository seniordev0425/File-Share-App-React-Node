import React from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'

const hp = [14]
const vp = [17, 34, 51, 68, 85, 102]

function Chart(props) {
  const { ratio, data, yKey, lineColor } = props
  const margin = 0

  return <div style={{ position: 'relative', paddingTop: `${ratio}%` }}>
    <div style={{ position: 'absolute', left: margin, top: margin + 1, right: margin, bottom: margin + 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={700}
          height={700 * ratio / 100}
          data={data}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <CartesianGrid
            horizontalPoints={hp}
            verticalPoints={vp}
            stroke="#ddd"
          />
          <Line type="monotone" dataKey={yKey} stroke={lineColor} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}

Chart.propTypes = {
  ratio: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  yKey: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
}

export default Chart
