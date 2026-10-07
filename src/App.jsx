import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import KpiCard from './components/KpiCard.jsx';
import RevenueChart from './components/RevenueChart.jsx';
import CategoryChart from './components/CategoryChart.jsx';
import OrdersTable from './components/OrdersTable.jsx';
import { recentOrders, summarize } from './data.js';
import { fmtCents, fmtCurrency, fmtNumber } from './format.js';
import { useTheme } from './theme.js';

export default function App() {
  const [range, setRange] = useState(30);
  const [navOpen, setNavOpen] = useState(false);
  const { mode, colors, toggle } = useTheme();
  const { series, now, prev, byCategory } = useMemo(() => summarize(range), [range]);

  const kpis = [
    { label: 'Revenue', key: 'revenue', format: fmtCurrency },
    { label: 'Orders', key: 'orders', format: fmtNumber },
    { label: 'Avg. order value', key: 'aov', format: fmtCents },
    { label: 'New customers', key: 'customers', format: fmtNumber },
  ];

  const q = query.trim().toLowerCase();
  const orders = q
    ? recentOrders.filter((o) => `${o.id} ${o.customer} ${o.category}`.toLowerCase().includes(q))
    : recentOrders;

  return (
    <>
    <Navbar query={query} onQueryChange={setQuery} onMenu={() => setNavOpen(true)} />
    <div className="layout">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="main">
        <Topbar range={range} onRangeChange={setRange} mode={mode} onToggleTheme={toggle} />
        <main className="content">
          <div className="kpi-grid">
            {kpis.map((k) => (
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
          <OrdersTable orders={recentOrders} />
        </main>
      </div>
    </div>
  );
}
