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
    };
  };

  const byCategory = CATEGORIES.map(({ name }) => ({
    name,
    value: current.reduce((acc, r) => acc + r.categories[name], 0),
  })).sort((a, b) => b.value - a.value);

  return { series: current, now: totals(current), prev: totals(previous), byCategory };
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
