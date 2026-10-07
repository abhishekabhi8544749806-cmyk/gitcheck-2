export default function KpiCard({ label, value, current, previous, format }) {
  const change = previous ? (current - previous) / previous : 0;
  const up = change >= 0;
  const pct = `${Math.abs(change * 100).toFixed(1)}%`;

  return (
    <div className="card kpi">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-delta">
        <span className={up ? 'delta delta-up' : 'delta delta-down'}>
          <span aria-hidden="true">{up ? '▲' : '▼'}</span>
          <span className="sr-only">{up ? 'Up' : 'Down'}</span> {pct}
        </span>
        <span className="muted"> vs prior period ({format(previous)})</span>
      </p>
    </div>
  );
}
