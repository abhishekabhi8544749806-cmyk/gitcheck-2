# gitcheck-2 reviewer notes

## Architecture
This is a Vite-powered React 18 admin dashboard, with `src/App.jsx` composing layout and feature components under `src/components/`. Dashboard data and aggregation are centralized in `src/data.js`, formatting in `src/format.js`, and theme state/palettes in `src/theme.js`. Recharts renders the revenue and category visualizations.

## Conventions
- Use functional components with default exports; feature components live in `src/components/` and are imported explicitly with `.jsx` extensions, as in `src/App.jsx`.
- Keep derived dashboard values in memoized calculations: `App.jsx` uses `useMemo(() => summarize(range), [range])`.
- Centralize display formatting in `src/format.js`; use `fmtCurrency`, `fmtCents`, `fmtNumber`, `fmtDay`, and `fmtTime` rather than ad hoc formatting in components.
- Shared chart presentation belongs in `ChartTooltip.jsx`; both chart components provide formatter functions and chart-specific options.
- Recharts colors must be passed as resolved hex values from `useTheme()` (`src/theme.js`), because SVG chart attributes do not consume CSS variables. Keep `theme.js` palettes synchronized with `src/index.css`.
- Use stable data keys for rendered collections: `k.key` for KPI cards, channel/category names for charts, and `o.id` for order rows.
- Accessibility is implemented alongside UI structure: sections use `aria-labelledby`, table headers use `scope="col"`, navigation uses `aria-current`, and decorative icons/swatches use `aria-hidden`.
- Status and state must not rely on color alone. `OrdersTable.jsx` pairs each status color class with an icon and text; `RevenueChart.jsx` adds direct end labels to lines.
- Styling is class-based, with inline styles reserved for dynamic chart dimensions and colors (for example, `style={{ height: 300 }}` and palette-driven swatches).

## Intentional non-standard choices
- `src/data.js` deliberately generates deterministic sample data with a seeded `mulberry32` randomizer so the dashboard is visually stable between loads; it is explicitly intended to be replaced by API calls later.
- Navigation links in `Sidebar.jsx` intentionally use `href="#"` and prevent default behavior because the sample dashboard has no routing.
- Chart animations are disabled with `isAnimationActive={false}` to keep dashboard rendering stable.
- KPI comparisons treat a zero/absent previous value as zero change in `KpiCard.jsx`.

## Watch out for
- Do not introduce random or time-dependent data generation without preserving the deterministic sample behavior in `src/data.js`.
- Preserve the data-unit conventions: generated monetary values are numeric dollar amounts, while `fmtCents` is used for amounts/AOV requiring cents precision.
- When adding channels or categories, update the corresponding constants, aggregation logic, chart series colors, and labels consistently (`src/data.js`, `src/theme.js`, and chart components).
- Avoid removing accessible text when replacing icons or status indicators; color-only chart legends/statuses violate the patterns established in `Sidebar.jsx`, `OrdersTable.jsx`, and `RevenueChart.jsx`.
- Changes to theme behavior must preserve OS preference fallback, localStorage persistence, and `<html data-theme>` updates in `src/theme.js`.