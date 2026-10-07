import { fmtCents, fmtTime } from '../format.js';

// Status always pairs an icon with a text label; color is never the only cue.
const STATUS = {
  paid: { label: 'Paid', icon: '✓' },
  pending: { label: 'Pending', icon: '◷' },
  refunded: { label: 'Refunded', icon: '↺' },
  failed: { label: 'Failed', icon: '✕' },
};

export default function OrdersTable({ orders }) {
  return (
    <section className="card" aria-labelledby="orders-title">
      <div className="card-head">
        <div>
          <h2 id="orders-title">Recent orders</h2>
          <p className="muted">Latest {orders.length} orders</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Category</th>
              <th scope="col">Placed</th>
              <th scope="col">Status</th>
              <th scope="col" className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const s = STATUS[o.status];
              return (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="muted">{o.category}</td>
                  <td className="muted">{fmtTime(o.placed)}</td>
                  <td>
                    <span className={`status status-${o.status}`}>
                      <span className="status-icon" aria-hidden="true">{s.icon}</span>
                      {s.label}
                    </span>
                  </td>
                  <td className="num">{fmtCents(o.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
