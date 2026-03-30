import React, { useRef, useEffect } from 'react';
import { products } from '../lib/data';
import { watchState } from '../lib/store';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

export function HtmlOverlay({ activeSection }: { activeSection: number }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cutoutLeftRef = useRef<HTMLDivElement>(null);
  const cutoutRightRef = useRef<HTMLDivElement>(null);

  // Cursor follow
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 180}px, ${e.clientY - 180}px)`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Sync backdrop + cutout colors with watchState via RAF
  useEffect(() => {
    let raf: number;
    const sync = () => {
      const hex = '#' + watchState.colors.backdrop.getHexString();
      if (backdropRef.current) backdropRef.current.style.backgroundColor = hex;
      if (cutoutLeftRef.current) cutoutLeftRef.current.style.backgroundColor = hex;
      if (cutoutRightRef.current) cutoutRightRef.current.style.backgroundColor = hex;
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeSide = products[activeSection]?.watchSide || 'left';

  return (
    <>
      {/* ── Layer 0: Colored backdrop ─────────────── */}
      <div ref={backdropRef} className="backdrop-layer" />

      {/* ── Layer 1: Dark textured panel ──────────── */}
      <div className="dark-panel" />

      {/* ── Layer 2: Concave cutouts ──────────────── */}
      <div ref={cutoutLeftRef} className="cutout-left" />
      <div ref={cutoutRightRef} className="cutout-right" />

      {/* ── Cursor glow ──────────────────────────── */}
      <div ref={cursorRef} className="cursor-blob" />

      {/* ── Header ───────────────────────────────── */}
      <header className="site-header" id="site-header">
        <div className="brand-group">
          <Menu className="hamburger" size={20} />
          <h1>S'wisp</h1>
        </div>
        <nav className="nav-links">
          <a href="#" className="active">Men</a>
          <a href="#">Women</a>
        </nav>
        <div className="header-actions">
          <Search size={18} />
          <User size={18} />
          <ShoppingCart size={18} />
        </div>
      </header>

      {/* ── Step indicators (left) ───────────────── */}
      <div className="step-nav" id="step-nav">
        {products.map((p, i) => (
          <div
            key={p.id}
            className={`step-entry ${i === activeSection ? 'active' : 'inactive'}`}
          >
            <span className="step-num">0{i + 1}</span>
            {i === activeSection && <div className="step-strike" />}
          </div>
        ))}
      </div>

      {/* ── Content slides ───────────────────────── */}
      {products.map((p, i) => {
        const isActive = i === activeSection;
        // Content goes on opposite side from the watch
        const contentSide = p.watchSide === 'left' ? 'content-right' : 'content-left';
        return (
          <div
            key={p.id}
            className={`content-slide ${contentSide} ${isActive ? 'visible' : i < activeSection ? 'hidden-up' : 'hidden-down'}`}
          >
            <div className="sw-label">
              <div className="vline" />
              <span>Smart Watch</span>
            </div>

            <h2 className="watch-title" id={`watch-title-${p.id}`}>
              {p.name}
              <br />
              <span className="thin">{p.subtitle}</span>
            </h2>

            <p className="watch-desc">{p.description}</p>

            <button className="cta-btn" id={`cta-btn-${p.id}`}>
              Add to cart — {p.price}
              <span className="arrow">\u2192</span>
            </button>
          </div>
        );
      })}

      {/* ── WATCH watermark (right edge) ─────────── */}
      <div className="watch-watermark">WATCH</div>

      {/* ── Social links (bottom left) ───────────── */}
      <footer className="social-links" id="social-links">
        <a href="#">f</a>
        <a href="#">x</a>
        <a href="#">ig</a>
      </footer>

      {/* ── Scroll indicator (bottom right) ──────── */}
      <div className="scroll-indicator">
        <div className="line" />
      </div>

      {/* ── Scroll spacer sections (invisible) ───── */}
      <div className="scroll-space">
        {products.map((p) => (
          <div key={p.id} className="page" />
        ))}
      </div>
    </>
  );
}
