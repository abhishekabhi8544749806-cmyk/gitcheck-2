import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHANNELS } from '../data.js';
import { fmtCompactCurrency, fmtCurrency, fmtDay } from '../format.js';
import ChartTooltip from './ChartTooltip.jsx';

// Direct label at the end of each line so identity never relies on color alone.
function EndLabel({ name, count, color }) {
  return function Label({ x, y, index }) {
    if (index !== count - 1) return null;
    return (
      <g>
        <circle cx={x} cy={y} r={4} fill={color} />
        <text x={x + 8} y={y} dy="0.35em" className="direct-label">
          {name}
        </text>
      </g>
    );
  };
}

export default function RevenueChart({ data, colors }) {
  const rows = data.map((d) => ({ ...d, ts: d.date.getTime() }));
  const totals = CHANNELS.map((c) => rows.reduce((acc, r) => acc + r[c], 0));

  return (
    <section className="card chart-card" aria-labelledby="rev-title">
      <div className="card-head">
        <div>
          <h2 id="rev-title">Revenue by channel</h2>
          <p className="muted">Daily revenue, USD</p>
        </div>
        <ul className="legend">
          {CHANNELS.map((c, i) => (
            <li key={c}>
              <span className="swatch swatch-line" style={{ background: colors.series[i] }} aria-hidden="true" />
              {c} <span className="muted">{fmtCompactCurrency(totals[i])}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chart-body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 12, right: 72, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="ts"
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
              tickFormatter={(t) => fmtDay(new Date(t))}
              tick={{ fill: colors.muted, fontSize: 12 }}
              stroke={colors.axis}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={fmtCompactCurrency}
              tick={{ fill: colors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: colors.muted, strokeDasharray: '3 3' }}
              content={
                <ChartTooltip
                  labelFormatter={(t) => fmtDay(new Date(t))}
                  valueFormatter={fmtCurrency}
                  showTotal
                />
              }
            />
            {CHANNELS.map((c, i) => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                name={c}
                stroke={colors.series[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, stroke: colors.surface, strokeWidth: 2 }}
                label={EndLabel({ name: c, count: rows.length, color: colors.series[i] })}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
