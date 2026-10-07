import { useCallback, useEffect, useRef, useState } from 'react';
import { fmtCurrency, fmtNumber } from '../format.js';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Horizontally scrolling row of product cards. Native scrolling with snap points
// handles swipe, trackpad and keyboard; the arrow buttons page by the visible width.
export default function ProductCarousel({ products }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  // Re-rank on range change: start from the top product again.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [products]);

  const page = (dir) => {
    const el = trackRef.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section className="card" aria-roledescription="carousel" aria-labelledby="products-title">
      <div className="card-head">
        <div>
          <h2 id="products-title">Top products</h2>
          <p className="muted">Ranked by revenue for the selected range</p>
        </div>
        <div className="carousel-controls">
          <button className="icon-btn" onClick={() => page(-1)} disabled={atStart} aria-label="Previous products">
            ‹
          </button>
          <button className="icon-btn" onClick={() => page(1)} disabled={atEnd} aria-label="Next products">
            ›
          </button>
        </div>
      </div>

      <ol className="carousel-track" ref={trackRef} tabIndex={0} aria-label="Products, scroll horizontally">
        {products.map((p, i) => {
          const change = p.prevRevenue ? (p.revenue - p.prevRevenue) / p.prevRevenue : 0;
          const up = change >= 0;
          return (
            <li
              key={p.sku}
              className="product-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${products.length}: ${p.name}`}
            >
              <div className="product-top">
                <span className="product-rank">#{i + 1}</span>
                <span className="product-sku mono">{p.sku}</span>
              </div>
              <p className="product-name">{p.name}</p>
              <p className="product-category muted">{p.category}</p>
              <p className="product-revenue">{fmtCurrency(p.revenue)}</p>
              <p className="product-meta">
                <span className={up ? 'delta delta-up' : 'delta delta-down'}>
                  <span aria-hidden="true">{up ? '▲' : '▼'}</span>
                  <span className="sr-only">{up ? 'Up' : 'Down'}</span> {Math.abs(change * 100).toFixed(1)}%
                </span>
                <span className="muted">{fmtNumber(p.units)} sold</span>
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
