import { useEffect, useState } from 'react';

export const PAGES = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'orders', label: 'Orders', icon: '☰' },
  { id: 'products', label: 'Products', icon: '◫' },
  { id: 'customers', label: 'Customers', icon: '◉' },
  { id: 'reports', label: 'Reports', icon: '◔' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export const pageHref = (id) => (id === 'overview' ? '#/' : `#/${id}`);

function pageFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '');
  return PAGES.find((p) => p.id === id) ?? PAGES[0];
}

// Hash-based routing: the current page follows the URL, so links,
// reloads and the back button all work without a router dependency.
export function usePage() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onChange = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return page;
}
