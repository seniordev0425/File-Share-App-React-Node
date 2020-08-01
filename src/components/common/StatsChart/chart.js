import React from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'


function Chart(props) {
  const { ratio, data, xKey, yKey, yKeyFormatter, name, lineColor, lineWidth, fillColor } = props

  return <div style={{ position: 'relative', paddingTop: `${ratio + 1}%` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={800} height={800 * ratio / 100} data={data} margin={{ top: 20, right: 50, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="gradient_purple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#8e6acc" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#6769ed" stopOpacity={0.35}/>
            </linearGradient>
            <linearGradient id="gradient_green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#2cd387" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#3ec3bd" stopOpacity={0.35}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eeeef1" />
          <XAxis dataKey={xKey} dy={8} stroke="#dfe0e4" strokeWidth="2" />
          <YAxis
            tickFormatter={yKeyFormatter || (e => e)}
            dx={-8}
            width={80} //increased from default 60 to prevent cutoff text, probably need something dynamic: https://github.com/recharts/recharts/issues/1480, https://github.com/recharts/recharts/issues/1127
            stroke="#dfe0e4"
            strokeWidth="2"
          />
          <Area name={name} type="monotone" dataKey={yKey} stroke={lineColor} strokeWidth={lineWidth} fill={fillColor} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
}

Chart.propTypes = {
  ratio: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  xKey: PropTypes.string.isRequired,
  yKey: PropTypes.string.isRequired,
  yKeyFormatter: PropTypes.func,
  name: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
}

export default Chart
