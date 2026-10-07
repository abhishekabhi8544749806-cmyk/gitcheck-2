const NAV = [
  { label: 'Overview', icon: '▦', active: true },
  { label: 'Orders', icon: '☰' },
  { label: 'Products', icon: '◫' },
  { label: 'Customers', icon: '◉' },
  { label: 'Reports', icon: '◔' },
  { label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <nav>
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={item.active ? 'nav-link is-active' : 'nav-link'}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
    </>
  );
}
