export const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
];

// Page header. The date range only applies to the dashboard, so it is
// shown only when `range` is passed.
export default function Topbar({ title, subtitle, range, onRangeChange, mode, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <div className="topbar-actions">
        {range != null && (
          <div className="segmented" role="radiogroup" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r.days}
                role="radio"
                aria-checked={range === r.days}
                className={range === r.days ? 'is-selected' : ''}
                onClick={() => onRangeChange(r.days)}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
          title="Toggle theme"
        >
          {mode === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
