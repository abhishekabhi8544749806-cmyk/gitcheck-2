const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const currencyCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const number = new Intl.NumberFormat('en-US');

export const fmtCurrency = (v) => currency.format(v);
export const fmtCents = (v) => currencyCents.format(v);
export const fmtCompactCurrency = (v) => `$${compact.format(v)}`;
export const fmtNumber = (v) => number.format(v);
export const fmtDay = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
