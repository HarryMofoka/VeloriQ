import React, { useEffect, useRef, useState } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { HtmlOverlay } from './components/HtmlOverlay';
import { ReactLenis as Lenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from './lib/data';
import { watchState } from './lib/store';
import * as THREE from 'three';
import { Loader } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          const section = Math.min(
            Math.floor(progress * products.length),
            products.length - 1
          );
          setActiveSection(section);
          // Store progress for screen time/date switching
          watchState.progress = progress;
        },
      },
    });

    // Build states — watch stays in same position, only subtle rotation varies
    const states = products.map((p, i) => ({
      rotation: new THREE.Euler(
        0.08 + Math.sin(i * 1.3) * 0.08,   // Very subtle tilt variation
        -0.25 + Math.cos(i * 0.9) * 0.15,  // Gentle turn
        0,
      ),
      // Watch stays slightly left of center — UNIFORM positioning
      position: new THREE.Vector3(-1.2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      colors: {
        case: new THREE.Color(p.caseColor),
        strap: new THREE.Color(p.strapColor),
        accent: new THREE.Color(p.accentColor),
        bg: new THREE.Color(p.bgColor),
        circle: new THREE.Color(p.circleColor),
        backdrop: new THREE.Color(p.backdropColor),
      },
    }));

    // Initialize to first product
    watchState.rotation.copy(states[0].rotation);
    watchState.position.copy(states[0].position);
    watchState.scale.copy(states[0].scale);
    watchState.colors.case.copy(states[0].colors.case);
    watchState.colors.strap.copy(states[0].colors.strap);
    watchState.colors.accent.copy(states[0].colors.accent);
    watchState.colors.bg.copy(states[0].colors.bg);
    watchState.colors.circle.copy(states[0].colors.circle);
    watchState.colors.backdrop.copy(states[0].colors.backdrop);

    // Animate between each pair of product states
    for (let i = 0; i < states.length - 1; i++) {
      const next = states[i + 1];

      tl.to(watchState.rotation, { x: next.rotation.x, y: next.rotation.y, z: next.rotation.z, ease: 'power2.inOut' }, i);
      tl.to(watchState.position, { x: next.position.x, y: next.position.y, z: next.position.z, ease: 'power2.inOut' }, i);
      tl.to(watchState.scale, { x: next.scale.x, y: next.scale.y, z: next.scale.z, ease: 'power2.inOut' }, i);

      // Colors
      tl.to(watchState.colors.case, { r: next.colors.case.r, g: next.colors.case.g, b: next.colors.case.b, ease: 'power2.inOut' }, i);
      tl.to(watchState.colors.strap, { r: next.colors.strap.r, g: next.colors.strap.g, b: next.colors.strap.b, ease: 'power2.inOut' }, i);
      tl.to(watchState.colors.accent, { r: next.colors.accent.r, g: next.colors.accent.g, b: next.colors.accent.b, ease: 'power2.inOut' }, i);
      tl.to(watchState.colors.bg, { r: next.colors.bg.r, g: next.colors.bg.g, b: next.colors.bg.b, ease: 'power2.inOut' }, i);
      tl.to(watchState.colors.circle, { r: next.colors.circle.r, g: next.colors.circle.g, b: next.colors.circle.b, ease: 'power2.inOut' }, i);
      tl.to(watchState.colors.backdrop, { r: next.colors.backdrop.r, g: next.colors.backdrop.g, b: next.colors.backdrop.b, ease: 'power2.inOut' }, i);
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Lenis root>
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
          <CanvasContainer />
          <HtmlOverlay activeSection={activeSection} />
        </div>
      </Lenis>
      <Loader
        containerStyles={{ background: '#000' }}
        innerStyles={{ background: '#222', width: '240px', height: '2px', borderRadius: '1px' }}
        barStyles={{ background: '#fff', height: '2px' }}
        dataStyles={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Space Grotesk', letterSpacing: '0.2em' }}
      />
    </>
  );
}
