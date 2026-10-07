import { PAGES, pageHref } from '../pages.js';

export default function Sidebar({ current, open, onClose }) {
  return (
    <>
      <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <nav>
          <ul>
            {PAGES.map((page) => {
              const active = page.id === current;
              return (
                <li key={page.id}>
                  <a
                    href={pageHref(page.id)}
                    className={active ? 'nav-link is-active' : 'nav-link'}
                    aria-current={active ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <span className="nav-icon" aria-hidden="true">{page.icon}</span>
                    {page.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
    </>
  );
}
