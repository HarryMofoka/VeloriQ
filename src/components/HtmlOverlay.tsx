import React, { useRef, useEffect } from 'react';
import { products } from '../lib/data';
import { watchState } from '../lib/store';
import { usePricing } from '../lib/usePricing';
import { uiActions, useUIState } from '../lib/uiStore';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

export function HtmlOverlay({ activeSection }: { activeSection: number }) {
  const { formatPrice } = usePricing();
  const { cartItems } = useUIState();
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

      const rawStep = watchState.progress * (products.length - 1);
      const slides = document.querySelectorAll('.content-slide');

      slides.forEach((slide, i) => {
        const el = slide as HTMLElement;
        const dist = rawStep - i;
        const absDist = Math.abs(dist);
        
        // Opacity drops to 0 when sliding away by 40% of the interval
        // That guarantees a dead-zone between 0.4 and 0.6 where text is entirely hidden
        let opacity = 0;
        if (absDist < 0.4) {
          opacity = 1 - (absDist / 0.4);
          // Ease it using sine for a smoother fade
          opacity = Math.sin(opacity * (Math.PI / 2));
        }

        // Float up/down directionably
        const yOffset = -dist * 60;

        if (opacity > 0) {
          el.style.opacity = opacity.toString();
          el.style.transform = `translateY(calc(-50% + ${yOffset}px))`;
          el.style.pointerEvents = opacity > 0.8 ? 'auto' : 'none';
          el.style.visibility = 'visible';
        } else {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
        }
      });

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
          <Menu onClick={uiActions.toggleMenu} className="hamburger cursor-pointer hover:scale-110 transition-transform" size={20} />
          <h1>VeloriQ</h1>
        </div>
        <nav className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); uiActions.toggleMenu(); }} className="active">Men</a>
          <a href="#" onClick={(e) => { e.preventDefault(); uiActions.toggleMenu(); }}>Women</a>
        </nav>
        <div className="header-actions">
          <Search onClick={uiActions.toggleSearch} className="cursor-pointer hover:scale-110 transition-transform" size={18} />
          <User onClick={uiActions.toggleUser} className="cursor-pointer hover:scale-110 transition-transform" size={18} />
          <div className="relative">
            <ShoppingCart onClick={uiActions.toggleCart} className="cursor-pointer hover:scale-110 transition-transform" size={18} />
            {cartItems.length > 0 && (
              <div 
                onClick={uiActions.toggleCart} 
                className="absolute -top-3 -right-3 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform"
              >
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
            )}
          </div>
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
            className={`content-slide ${contentSide}`}
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

            <button 
              className="cta-btn" 
              id={`cta-btn-${p.id}`}
              onClick={() => uiActions.addToCart(p.id)}
            >
              Add to cart — {formatPrice(p.basePrice)}
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
