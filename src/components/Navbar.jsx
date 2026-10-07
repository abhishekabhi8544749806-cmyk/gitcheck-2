import { useEffect, useRef, useState } from 'react';

const NOTIFICATIONS = [
  { id: 1, text: 'Order #10478 payment failed', time: '12 min ago', unread: true },
  { id: 2, text: 'Refund issued for order #10479', time: '1 hr ago', unread: true },
  { id: 3, text: 'Weekly report is ready', time: 'Yesterday', unread: false },
];

const USER = { name: 'Jordan Lee', email: 'jordan@acme.example' };

// Closes a dropdown on outside click or Escape.
function useDismiss(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);
  return ref;
}

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Navbar({ query, onQueryChange, onMenu }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useDismiss(notifOpen, setNotifOpen);
  const userRef = useDismiss(userOpen, setUserOpen);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="navbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">
        ☰
      </button>
      <a href="#" className="brand" onClick={(e) => e.preventDefault()}>
        <span className="brand-mark" aria-hidden="true">A</span>
        <span className="brand-name">Acme Admin</span>
      </a>

      <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search orders or customers…"
          aria-label="Search orders or customers"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </form>

      <div className="navbar-actions">
        <div className="dropdown" ref={notifRef}>
          <button
            className="icon-btn"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => {
              setNotifOpen((o) => !o);
              setUserOpen(false);
            }}
          >
            <span aria-hidden="true">🔔</span>
            {unread > 0 && <span className="badge" aria-hidden="true">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="menu menu-wide" role="menu">
              <div className="menu-head">
                <span>Notifications</span>
                {unread > 0 && (
                  <button
                    className="link-btn"
                    onClick={() => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })))}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul>
                {notifications.map((n) => (
                  <li key={n.id} className={n.unread ? 'notif is-unread' : 'notif'} role="menuitem">
                    <span className="notif-dot" aria-hidden="true" />
                    <span>
                      {n.text}
                      <span className="notif-time">{n.time}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="dropdown" ref={userRef}>
          <button
            className="user-btn"
            aria-label="Account menu"
            aria-expanded={userOpen}
            aria-haspopup="true"
            onClick={() => {
              setUserOpen((o) => !o);
              setNotifOpen(false);
            }}
          >
            <span className="avatar" aria-hidden="true">{initials(USER.name)}</span>
            <span className="user-name">{USER.name}</span>
            <span className="caret" aria-hidden="true">▾</span>
          </button>
          {userOpen && (
            <div className="menu" role="menu">
              <div className="menu-head menu-user">
                <span>{USER.name}</span>
                <span className="muted">{USER.email}</span>
              </div>
              <ul>
                {['Profile', 'Settings', 'Sign out'].map((item) => (
                  <li key={item}>
                    <button role="menuitem" className="menu-item" onClick={() => setUserOpen(false)}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
