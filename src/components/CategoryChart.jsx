import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fmtCompactCurrency, fmtCurrency } from '../format.js';
import ChartTooltip from './ChartTooltip.jsx';

export default function CategoryChart({ data, colors }) {
  return (
    <section className="card chart-card" aria-labelledby="cat-title">
      <div className="card-head">
        <div>
          <h2 id="cat-title">Revenue by category</h2>
          <p className="muted">Total for the selected range</p>
        </div>
      </div>
      <div className="chart-body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 56, bottom: 0, left: 0 }} barCategoryGap={6}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={112}
              tick={{ fill: colors.muted, fontSize: 12 }}
              axisLine={{ stroke: colors.axis }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: colors.grid, opacity: 0.5 }}
              content={<ChartTooltip valueFormatter={fmtCurrency} />}
            />
            <Bar dataKey="value" name="Revenue" fill={colors.series[0]} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              <LabelList dataKey="value" position="right" formatter={fmtCompactCurrency} className="bar-label" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
