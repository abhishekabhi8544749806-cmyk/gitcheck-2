import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import KpiCard from './components/KpiCard.jsx';
import RevenueChart from './components/RevenueChart.jsx';
import CategoryChart from './components/CategoryChart.jsx';
import OrdersTable from './components/OrdersTable.jsx';
import { recentOrders, summarize } from './data.js';
import { fmtCents, fmtCurrency, fmtNumber } from './format.js';
import { usePage } from './pages.js';
import { useTheme } from './theme.js';

const KPIS = [
  { label: 'Revenue', key: 'revenue', format: fmtCurrency },
  { label: 'Orders', key: 'orders', format: fmtNumber },
  { label: 'Avg. order value', key: 'aov', format: fmtCents },
  { label: 'New customers', key: 'customers', format: fmtNumber },
];

function Dashboard({ range, colors, query }) {
  const { series, now, prev, byCategory } = useMemo(() => summarize(range), [range]);

  const q = query.trim().toLowerCase();
  const orders = q
    ? recentOrders.filter((o) => `${o.id} ${o.customer} ${o.category}`.toLowerCase().includes(q))
    : recentOrders;

  return (
    <>
      <div className="kpi-grid">
        {KPIS.map((k) => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={k.format(now[k.key])}
            current={now[k.key]}
            previous={prev[k.key]}
            format={k.format}
          />
        ))}
      </div>
      <div className="chart-grid">
        <RevenueChart data={series} colors={colors} />
        <CategoryChart data={byCategory} colors={colors} />
      </div>
      <OrdersTable orders={orders} query={q} />
    </>
  );
}

function Placeholder({ label }) {
  return (
    <section className="card placeholder">
      <h2>{label}</h2>
      <p className="muted">This page hasn’t been built yet.</p>
    </section>
  );
}

export default function App() {
  const page = usePage();
  const [range, setRange] = useState(30);
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { mode, colors, toggle } = useTheme();
  const isDashboard = page.id === 'overview';

  return (
    <>
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onMenu={() => setNavOpen(true)}
        showNotifications={isDashboard}
      />
      <div className="layout">
        <Sidebar current={page.id} open={navOpen} onClose={() => setNavOpen(false)} />
        <div className="main">
          {isDashboard ? (
            <Topbar
              title={page.label}
              subtitle={`Store performance for the last ${range} days`}
              range={range}
              onRangeChange={setRange}
              mode={mode}
              onToggleTheme={toggle}
            />
          ) : (
            <Topbar title={page.label} mode={mode} onToggleTheme={toggle} />
          )}
          <main className="content">
            {isDashboard ? (
              <Dashboard range={range} colors={colors} query={query} />
            ) : (
              <Placeholder label={page.label} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
