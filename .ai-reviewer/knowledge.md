# gitcheck-2 reviewer notes

## Architecture

This is a Vite-powered React 18 admin dashboard, with the application composed in `src/App.jsx` from navigation, page chrome, KPI, chart, carousel, and table components. Dashboard data is currently generated deterministically in `src/data.js`, summarized by date range, and formatted through shared helpers in `src/format.js`. Routing/theme behavior is handled by local hooks/modules (`src/pages.js`, `src/theme.js`), while Recharts supplies the visualizations.

## Conventions

- Components are small, named React functions in `src/components/`, with `.jsx` extensions and default exports; `App.jsx` composes them explicitly.
- Shared display formatting belongs in `src/format.js`; use the existing helpers (`fmtCurrency`, `fmtCents`, `fmtPercent`, `fmtTime`) rather than formatting values inline.
- Dashboard metrics are configured declaratively through the `KPIS` array in `src/App.jsx`; new KPI cards should provide a key, label, formatter, and only the applicable flags such as `rate` or `lowerIsBetter`.
- Monetary and count calculations are performed in `src/data.js`, while presentation-only rounding/formatting is kept in `src/format.js` and components.
- Recharts components receive theme-aware `colors` from their parent and use `isAnimationActive={false}` (`RevenueChart.jsx`, `CategoryChart.jsx`) for stable rendering.
- Accessibility is built into component structure: sections use `aria-labelledby`, tables use scoped column headers (`OrdersTable.jsx`), active navigation uses `aria-current` (`Sidebar.jsx`), and icon-only controls have labels.
- Color is not the sole semantic signal. Statuses pair icons with labels (`OrdersTable.jsx`), chart lines have direct end labels (`RevenueChart.jsx`), and deltas include screen-reader text (`KpiCard.jsx`, `ProductCarousel.jsx`).
- Interactive dropdowns should use the `useDismiss` pattern in `Navbar.jsx`, closing on outside pointer events and Escape with effect cleanup.
- Client-side search is intentionally centralized in `Dashboard` (`App.jsx`) and matches order ID, customer, and category against a normalized query.

## Intentional non-standard choices

- `src/data.js` uses seeded pseudo-random generators and a fixed 180-day dataset so the dashboard remains visually deterministic across loads; changes to generator ordering can change fixture output.
- Most non-overview pages intentionally render `Placeholder` in `App.jsx`; they are not expected to have full page implementations yet.
- The carousel uses native horizontal scrolling, scroll snapping, `ResizeObserver`, and imperative `scrollTo`/`scrollBy` (`ProductCarousel.jsx`) instead of a carousel library.
- Notification and account-menu state is local to `Navbar.jsx`; notification read state survives page changes because the navbar remains mounted.

## Watch out for

- Preserve separate random seeds in `src/data.js`; adding random calls to one generator can unintentionally alter unrelated dashboard data.
- When adding metrics, maintain the rate-vs-relative-change distinction in `KpiCard.jsx`; rate values are fractions and changes are reported in percentage points.
- Do not invert the delta arrow for “lower is better”: `lowerIsBetter` intentionally changes only semantic color, not direction (`KpiCard.jsx`).
- Keep chart identity and status meaning understandable without color alone; avoid removing direct labels, icons, text labels, or accessible names.
- Ensure new dropdowns and document listeners are cleaned up like `useDismiss`; avoid leaking global event handlers.
- `summarize(days)` assumes sufficient prior rows for comparison. New ranges or backend data must preserve current/previous window handling and avoid zero-denominator metric results.