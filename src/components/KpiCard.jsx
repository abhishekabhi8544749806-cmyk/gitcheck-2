// `rate` metrics (fractions like 0.031) report their change in percentage points;
// everything else reports a relative change. `lowerIsBetter` flips the color only,
// so the arrow always shows direction and the color shows good vs bad.
export default function KpiCard({ label, value, current, previous, format, rate, lowerIsBetter }) {
  const change = rate ? current - previous : previous ? (current - previous) / previous : 0;
  const up = change >= 0;
  const good = lowerIsBetter ? !up : up;
  const amount = rate ? `${Math.abs(change * 100).toFixed(2)} pts` : `${Math.abs(change * 100).toFixed(1)}%`;

  return (
    <div className="card kpi">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-delta">
        <span className={good ? 'delta delta-up' : 'delta delta-down'}>
          <span aria-hidden="true">{up ? '▲' : '▼'}</span>
          <span className="sr-only">{up ? 'Up' : 'Down'}</span> {amount}
        </span>
        <span className="muted"> vs prior period ({format(previous)})</span>
      </p>
    </div>
  );
}
