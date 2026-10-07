// Deterministic sample data so the dashboard looks the same on every load.
// Replace these generators with API calls when wiring up a real backend.

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const DAYS = 180;

export const CHANNELS = ['Organic', 'Paid', 'Referral'];

export const CATEGORIES = [
  { name: 'Electronics', weight: 0.31 },
  { name: 'Home & Kitchen', weight: 0.22 },
  { name: 'Apparel', weight: 0.17 },
  { name: 'Sports', weight: 0.12 },
  { name: 'Beauty', weight: 0.1 },
  { name: 'Books', weight: 0.08 },
];

function buildDaily() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const rows = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const t = DAYS - i;
    const weekday = date.getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.82 : 1;
    const trend = 1 + t / 400;
    const noise = () => 0.88 + rand() * 0.24;

    const Organic = Math.round(4200 * trend * weekend * noise());
    const Paid = Math.round(2600 * (1 + t / 260) * weekend * noise());
    const Referral = Math.round(1100 * trend * noise());
    const revenue = Organic + Paid + Referral;
    const orders = Math.round(revenue / (68 + rand() * 10));
    const customers = Math.round(orders * (0.28 + rand() * 0.08));

    const categories = {};
    for (const c of CATEGORIES) {
      categories[c.name] = Math.round(revenue * c.weight * (0.9 + rand() * 0.2));
    }

    rows.push({ date, Organic, Paid, Referral, revenue, orders, customers, categories });
  }
  return rows;
}

export const daily = buildDaily();

// Secondary metrics, merged into `daily`. Separate seed so they never shift the data above.
const metricRand = mulberry32(99);
for (const r of daily) {
  r.sessions = Math.round(r.orders / (0.028 + metricRand() * 0.006));
  r.refunds = Math.round(r.orders * (0.02 + metricRand() * 0.02));
  r.returning = Math.round(r.orders * (0.35 + metricRand() * 0.1));
  r.pending = Math.round(r.orders * (0.01 + metricRand() * 0.01));
}

export const PRODUCTS = [
  { sku: 'EL-104', name: 'Wireless Earbuds Pro', category: 'Electronics', price: 129, weight: 1.6, trend: 0.004 },
  { sku: 'EL-221', name: 'Smart Watch S2', category: 'Electronics', price: 199, weight: 0.9, trend: 0.002 },
  { sku: 'HK-310', name: 'Pour-Over Coffee Set', category: 'Home & Kitchen', price: 54, weight: 1.4, trend: -0.001 },
  { sku: 'HK-118', name: 'Cast Iron Skillet', category: 'Home & Kitchen', price: 39, weight: 1.5, trend: 0.001 },
  { sku: 'AP-502', name: 'Merino Crew Sweater', category: 'Apparel', price: 89, weight: 1.0, trend: 0.003 },
  { sku: 'AP-415', name: 'Everyday Rain Jacket', category: 'Apparel', price: 119, weight: 0.6, trend: 0.005 },
  { sku: 'SP-207', name: 'Yoga Mat Plus', category: 'Sports', price: 48, weight: 1.3, trend: -0.002 },
  { sku: 'SP-330', name: 'Insulated Bottle 1L', category: 'Sports', price: 32, weight: 1.8, trend: 0.001 },
  { sku: 'BE-150', name: 'Vitamin C Serum', category: 'Beauty', price: 36, weight: 1.6, trend: 0.002 },
  { sku: 'BK-090', name: 'The Pragmatic Cook', category: 'Books', price: 28, weight: 1.2, trend: -0.001 },
];

// Units sold per product per day, aligned with `daily`. Separate seed so adding
// products never shifts the other generated data.
const productRand = mulberry32(7);
const productDaily = daily.map((_, i) =>
  PRODUCTS.map((p) => Math.round(p.weight * 9 * (1 + p.trend * i) * (0.75 + productRand() * 0.5)))
);

function topProducts(days) {
  const unitsIn = (rows) => PRODUCTS.map((_, j) => rows.reduce((acc, r) => acc + r[j], 0));
  const now = unitsIn(productDaily.slice(-days));
  const prev = unitsIn(productDaily.slice(-days * 2, -days));
  return PRODUCTS.map((p, j) => ({
    ...p,
    units: now[j],
    revenue: now[j] * p.price,
    prevRevenue: prev[j] * p.price,
  })).sort((a, b) => b.revenue - a.revenue);
}

const sum = (rows, key) => rows.reduce((acc, r) => acc + r[key], 0);

// Current window = last `days` rows; previous window = the `days` before it.
export function summarize(days) {
  const current = daily.slice(-days);
  const previous = daily.slice(-days * 2, -days);

  const totals = (rows) => {
    const revenue = sum(rows, 'revenue');
    const orders = sum(rows, 'orders');
    return {
      revenue,
      orders,
      aov: orders ? revenue / orders : 0,
      customers: sum(rows, 'customers'),
      conversion: orders / sum(rows, 'sessions'),
      refundRate: sum(rows, 'refunds') / orders,
      returning: sum(rows, 'returning'),
      pending: sum(rows, 'pending'),
    };
  };

  const byCategory = CATEGORIES.map(({ name }) => ({
    name,
    value: current.reduce((acc, r) => acc + r.categories[name], 0),
  })).sort((a, b) => b.value - a.value);

  return {
    series: current,
    now: totals(current),
    prev: totals(previous),
    byCategory,
    products: topProducts(days),
  };
}

const CUSTOMERS = [
  'Priya Sharma', 'Liam Chen', 'Sofia Rossi', 'Noah Williams', 'Aisha Khan',
  'Mateo García', 'Emma Müller', 'Kenji Tanaka', 'Olivia Brown', 'Ravi Patel',
];
const STATUSES = ['paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'refunded', 'failed'];

export const recentOrders = Array.from({ length: 8 }, (_, i) => {
  const placed = new Date();
  placed.setMinutes(placed.getMinutes() - Math.round(i * 47 + rand() * 30));
  return {
    id: `#${(10482 - i).toString()}`,
    customer: CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)],
    category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)].name,
    amount: Math.round((25 + rand() * 280) * 100) / 100,
    status: STATUSES[Math.floor(rand() * STATUSES.length)],
    placed,
  };
});
