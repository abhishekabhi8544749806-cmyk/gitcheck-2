// Shared tooltip body for Recharts. Values stay in text ink; the swatch carries identity.
export default function ChartTooltip({ active, payload, label, labelFormatter, valueFormatter, showTotal }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((acc, p) => acc + (p.value ?? 0), 0);

  return (
    <div className="tooltip">
      <p className="tooltip-title">{labelFormatter ? labelFormatter(label) : label}</p>
      <ul>
        {payload.map((p) => (
          <li key={p.dataKey}>
            <span className="swatch" style={{ background: p.color }} aria-hidden="true" />
            <span className="tooltip-name">{p.name}</span>
            <span className="tooltip-value">{valueFormatter(p.value)}</span>
          </li>
        ))}
      </ul>
      {showTotal && payload.length > 1 && (
        <p className="tooltip-total">
          <span>Total</span>
          <span className="tooltip-value">{valueFormatter(total)}</span>
        </p>
      )}
    </div>
  );
}
