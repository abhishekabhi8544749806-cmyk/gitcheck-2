# gitcheck-2 reviewer notes

## Architecture

This is a Vite-powered React 18 admin dashboard. `src/App.jsx` owns page-level state and composes navigation, dashboard cards, charts, product carousel, and orders table; reusable UI lives under `src/components/`. Data generation, aggregation, formatting, routing, and theme behavior are separated into `src/data.js`, `src/format.js`, `src/pages.js`, and `src/theme.js`.

## Conventions

- Use functional React components with ES module imports/exports; components are one-per-file under `src/components/` and use `.jsx` extensions, as in `RevenueChart.jsx` and `OrdersTable.jsx`.
- Keep dashboard state in `App.jsx` and pass data/actions down as props. For example, `range`, `query`, and theme state are owned by `App`, while `Dashboard` derives filtered orders and summarized data.
- Derive expensive or range-dependent values with `useMemo`, as `Dashboard` does for `summarize(range)`.
- Centralize display formatting in `src/format.js`; currency, percentages, numbers, dates, and times should use the shared `fmt*` helpers rather than ad hoc formatting.
- Recharts visualizations receive theme-dependent colors through props (`RevenueChart.jsx`, `CategoryChart.jsx`) and disable animation with `isAnimationActive={false}`.
- Accessibility is explicit: landmark labels and heading relationships use `aria-label`/`aria-labelledby`; tables define `scope="col"`; interactive controls expose `aria-expanded`, `aria-haspopup`, `aria-current`, or `aria-checked` where applicable.
- Never rely on color alone for status or chart identity. `OrdersTable.jsx` pairs status colors with icons and labels, while `RevenueChart.jsx` adds direct end labels and `ChartTooltip.jsx` includes swatches plus text names.
- Interactive overlays and menus should clean up global listeners. Follow `Navbar.jsx`’s `useDismiss` pattern for outside-click and Escape dismissal.
- Preserve native interaction where possible: `ProductCarousel.jsx` uses a focusable, horizontally scrollable `<ol>` with native scrolling, snap behavior, keyboard support, and reduced-motion handling.
- Use stable domain identifiers as React keys: `k.key`, `o.id`, `p.sku`, or channel/category names rather than array indexes except where the index is only presentation metadata.

## Intentional non-standard choices

- `src/data.js` intentionally generates deterministic local sample data with seeded PRNGs (`mulberry32`) so the dashboard renders consistently; it is explicitly designed to be replaced by API calls later.
- `src/main.jsx` intentionally wraps the app in `React.StrictMode`; apparent development-only duplicate initialization should not be “fixed” by removing Strict Mode.
- Placeholder pages are intentional: `App.jsx` renders “This page hasn’t been built yet” for non-overview routes.

## Watch out for

- Do not introduce random, time-sensitive, or unseeded mock data into `src/data.js`; separate seeds are used so adding metrics/products does not shift unrelated generated values.
- Preserve the current/previous range semantics in `summarize`: current data is `slice(-days)` and the comparison window is the preceding `days`.
- Be careful with rate metrics in `KpiCard.jsx`: rates report percentage-point changes, while other metrics report relative percentage changes; `lowerIsBetter` changes color semantics only, not arrow direction.
- Avoid hard-coded chart colors, missing direct labels, or status styling that removes the accompanying text/icon accessibility cues.
- Maintain listener and observer cleanup in components using `useEffect`, especially `Navbar.jsx` and `ProductCarousel.jsx`.
