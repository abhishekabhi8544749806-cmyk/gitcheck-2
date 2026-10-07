export const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
];

export default function Topbar({ range, onRangeChange, mode, onToggleTheme, onMenu }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">
        ☰
      </button>
      <div className="topbar-title">
        <h1>Overview</h1>
        <p className="muted">Store performance for the last {range} days</p>
      </div>
      <div className="topbar-actions">
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
