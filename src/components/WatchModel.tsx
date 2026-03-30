import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { watchState } from '../lib/store';
import { products } from '../lib/data';

/* ── Procedural textures ────────────────────────────── */

function createMetalTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.fillRect(Math.random() * size, Math.random() * size, Math.random() * 180 + 30, 1);
  }
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 1200; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.lineWidth = Math.random() * 1.2;
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 35, y + (Math.random() - 0.5) * 35);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createStrapTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#999';
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 250; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 25 + 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < size; i += 3) {
    ctx.strokeStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    ctx.strokeStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
  }
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 10]);
  ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(70, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size - 70, 0); ctx.lineTo(size - 70, size); ctx.stroke();
  ctx.setLineDash([]);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  return tex;
}

/* ── Watch Face Canvas ──────────────────────────────── */

function drawWatchFace(
  ctx: CanvasRenderingContext2D,
  accentColor: THREE.Color,
  elapsed: number,
  time: string,
  date: string,
) {
  const s = 1024;
  const cx = s / 2;
  const cy = s / 2;
  const accentHex = '#' + accentColor.getHexString();
  const r255 = Math.round(accentColor.r * 255);
  const g255 = Math.round(accentColor.g * 255);
  const b255 = Math.round(accentColor.b * 255);
  const accentRgba = (a: number) => `rgba(${r255},${g255},${b255},${a})`;

  // ── Background ──────────────────────────────────────
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 512);
  bg.addColorStop(0, '#111111');
  bg.addColorStop(0.8, '#080808');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, s, s);

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.clip();

  // ── Edge accent glow ────────────────────────────────
  const edgeGlow = ctx.createRadialGradient(cx, cy, 380, cx, cy, 510);
  edgeGlow.addColorStop(0, 'transparent');
  edgeGlow.addColorStop(1, accentRgba(0.08));
  ctx.fillStyle = edgeGlow;
  ctx.fillRect(0, 0, s, s);

  // ── Outer ring ──────────────────────────────────────
  ctx.beginPath();
  ctx.arc(cx, cy, 490, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── Hour markers ────────────────────────────────────
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-2.5, -488, 5, 22);
    } else {
      ctx.beginPath();
      ctx.arc(0, -480, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();
    }
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  // ── Animated accent arc ─────────────────────────────
  const arcFill = 0.65 + Math.sin(elapsed * 0.8) * 0.1;
  ctx.beginPath();
  ctx.arc(cx, cy, 494, -Math.PI / 2, -Math.PI / 2 + arcFill * Math.PI * 2);
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Arc tip glow
  const tipAngle = -Math.PI / 2 + arcFill * Math.PI * 2;
  const tipX = cx + Math.cos(tipAngle) * 494;
  const tipY = cy + Math.sin(tipAngle) * 494;
  const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18);
  tipGlow.addColorStop(0, accentRgba(0.7));
  tipGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = tipGlow;
  ctx.beginPath();
  ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
  ctx.fill();

  // ── FOSSIL branding ─────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '500 26px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F O S S I L', cx, cy - 170);

  // ── TIME (centered) ─────────────────────────────────
  const [hrs, mins] = time.split(':');

  // Hours — large centered
  ctx.fillStyle = '#ffffff';
  ctx.font = '200 260px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hrs, cx, cy - 20);

  // Superscript minutes — positioned top-right of hours
  ctx.font = '200 260px "Inter", sans-serif';
  const hWidth = ctx.measureText(hrs).width;
  ctx.font = '600 100px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(mins, cx + hWidth / 2 + 6, cy - 120);

  // Pulsing colon
  ctx.globalAlpha = 0.3 + Math.abs(Math.sin(elapsed * 2)) * 0.7;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '300 60px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(':', cx + hWidth / 2 - 4, cy - 85);
  ctx.globalAlpha = 1;

  // Live seconds in accent color
  const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
  ctx.fillStyle = accentHex;
  ctx.font = '400 40px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(secs, cx + hWidth / 2 + 6, cy - 20);

  // ── Divider ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy + 80);
  ctx.lineTo(cx + 160, cy + 80);
  ctx.stroke();

  // ── Date + label ────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 34px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(date, cx, cy + 115);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '300 24px "Inter", sans-serif';
  ctx.fillText('Smart Harmony', cx, cy + 155);

  // ── Heart rate (bottom-left) ────────────────────────
  const hlx = cx - 130, hly = cy + 240;
  ctx.beginPath();
  ctx.arc(hlx, hly, 48, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 3;
  ctx.stroke();
  const pulse = 0.5 + Math.abs(Math.sin(elapsed * 3)) * 0.5;
  ctx.beginPath();
  ctx.arc(hlx, hly, 48, -Math.PI / 2, -Math.PI / 2 + pulse * Math.PI * 2);
  ctx.strokeStyle = '#ff4757';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#ff4757';
  ctx.font = '400 26px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u2665', hlx, hly - 8);
  const bpm = Math.round(72 + Math.sin(elapsed * 2) * 5);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillText(bpm.toString(), hlx, hly + 16);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 13px "Space Grotesk", sans-serif';
  ctx.fillText('BPM', hlx, hly + 35);

  // ── Battery (bottom-center) ─────────────────────────
  const bx = cx, by = cy + 270;
  ctx.beginPath();
  ctx.arc(bx, by, 36, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bx, by, 36, -Math.PI / 2, -Math.PI / 2 + 0.78 * Math.PI * 2);
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('78%', bx, by + 2);

  // ── Steps (bottom-right) ────────────────────────────
  const srx = cx + 130, sry = cy + 240;
  ctx.beginPath();
  ctx.arc(srx, sry, 48, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 3;
  ctx.stroke();
  const stepsFill = 0.42 + Math.sin(elapsed * 0.3) * 0.05;
  ctx.beginPath();
  ctx.arc(srx, sry, 48, -Math.PI / 2, -Math.PI / 2 + stepsFill * Math.PI * 2);
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = accentHex;
  ctx.font = '400 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u26A1', srx, sry - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillText('4.2k', srx, sry + 16);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 13px "Space Grotesk", sans-serif';
  ctx.fillText('STEPS', srx, sry + 35);

  // ── Sweeping second dot ─────────────────────────────
  const secA = -Math.PI / 2 + (elapsed % 60) * (Math.PI * 2 / 60);
  const dx = cx + Math.cos(secA) * 460;
  const dy = cy + Math.sin(secA) * 460;
  const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, 16);
  dg.addColorStop(0, accentRgba(0.6));
  dg.addColorStop(1, 'transparent');
  ctx.fillStyle = dg;
  ctx.beginPath();
  ctx.arc(dx, dy, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accentHex;
  ctx.beginPath();
  ctx.arc(dx, dy, 5, 0, Math.PI * 2);
  ctx.fill();

  // ── Notification beacon (top) ───────────────────────
  ctx.globalAlpha = 0.2 + Math.abs(Math.sin(elapsed * 1.8)) * 0.8;
  ctx.fillStyle = accentHex;
  ctx.beginPath();
  ctx.arc(cx, cy - 410, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

/* ── Watch Component ────────────────────────────────── */

interface WatchModelProps {
  [key: string]: any;
}

export function WatchModel(props: WatchModelProps) {
  const group = useRef<THREE.Group>(null);
  const caseMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const strapMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const metalTex = useMemo(() => createMetalTexture(), []);
  const strapTex = useMemo(() => createStrapTexture(), []);

  // Screen canvas
  const screenCanvas = useRef(document.createElement('canvas'));
  const screenTexture = useRef(new THREE.CanvasTexture(screenCanvas.current));

  useEffect(() => {
    screenCanvas.current.width = 1024;
    screenCanvas.current.height = 1024;
    // Draw initial face immediately so the screen isn't blank
    const ctx = screenCanvas.current.getContext('2d');
    if (ctx) {
      const p = products[0];
      drawWatchFace(ctx, new THREE.Color(p.accentColor), 0, p.screenTime, p.screenDate);
      screenTexture.current.needsUpdate = true;
    }
  }, []);

  // Mouse for tilt
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;

    // Smooth rotation with mouse tilt + floating
    const tx = watchState.rotation.x + mouse.current.y * 0.15;
    const ty = watchState.rotation.y + Math.sin(t * 0.4) * 0.03 + mouse.current.x * 0.15;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.08;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.08;
    group.current.rotation.z = watchState.rotation.z;

    // Position + floating
    group.current.position.copy(watchState.position);
    group.current.position.y += Math.sin(t * 0.5) * 0.04;
    group.current.scale.copy(watchState.scale);

    // Material colors
    if (caseMatRef.current) caseMatRef.current.color.copy(watchState.colors.case);
    if (strapMatRef.current) strapMatRef.current.color.copy(watchState.colors.strap);

    // Determine current product index for screen time/date
    const idx = Math.max(0, Math.min(products.length - 1, Math.round(watchState.progress * (products.length - 1))));
    const p = products[idx];

    // Draw face
    const ctx = screenCanvas.current.getContext('2d');
    if (ctx) {
      drawWatchFace(ctx, watchState.colors.accent, t, p.screenTime, p.screenDate);
      screenTexture.current.needsUpdate = true;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>

        {/* ── Case Body ──────────────── */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.38, 64]} />
          <meshPhysicalMaterial
            ref={caseMatRef}
            metalness={1}
            roughness={0.28}
            roughnessMap={metalTex}
            bumpMap={metalTex}
            bumpScale={0.001}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* ── Outer Bezel ────────────── */}
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.46, 0.08, 16, 64]} />
          <meshPhysicalMaterial
            metalness={1}
            roughness={0.25}
            roughnessMap={metalTex}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
            color={watchState.colors.case}
          />
        </mesh>

        {/* ── Inner Bezel ────────────── */}
        <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.39, 0.04, 16, 64]} />
          <meshPhysicalMaterial metalness={0.9} roughness={0.5} color="#0a0a0a" />
        </mesh>

        {/* ── Screen (flat disc facing outward) ─────── */}
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.36, 64]} />
          <meshStandardMaterial
            map={screenTexture.current}
            metalness={0}
            roughness={0.08}
            emissive={new THREE.Color(0xffffff)}
            emissiveMap={screenTexture.current}
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>

        {/* ── Crown + Pushers ────────── */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
          <meshPhysicalMaterial metalness={1} roughness={0.3} roughnessMap={metalTex} clearcoat={0.5} color={watchState.colors.case} />
        </mesh>
        <mesh position={[1.35, 0, 0.65]} rotation={[0, Math.PI / 6, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.18, 32]} />
          <meshPhysicalMaterial metalness={1} roughness={0.3} roughnessMap={metalTex} clearcoat={0.5} color={watchState.colors.case} />
        </mesh>
        <mesh position={[1.35, 0, -0.65]} rotation={[0, -Math.PI / 6, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.18, 32]} />
          <meshPhysicalMaterial metalness={1} roughness={0.3} roughnessMap={metalTex} clearcoat={0.5} color={watchState.colors.case} />
        </mesh>

        {/* ── Lugs ───────────────────── */}
        <RoundedBox position={[0, 0, 1.58]} args={[1.15, 0.28, 0.38]} radius={0.05} smoothness={4} castShadow>
          <meshPhysicalMaterial metalness={1} roughness={0.3} roughnessMap={metalTex} clearcoat={0.5} color={watchState.colors.case} />
        </RoundedBox>
        <RoundedBox position={[0, 0, -1.58]} args={[1.15, 0.28, 0.38]} radius={0.05} smoothness={4} castShadow>
          <meshPhysicalMaterial metalness={1} roughness={0.3} roughnessMap={metalTex} clearcoat={0.5} color={watchState.colors.case} />
        </RoundedBox>

        {/* ── Top Strap ──────────────── */}
        <group position={[0, 0, -1.78]}>
          <RoundedBox args={[1.05, 0.09, 2.4]} radius={0.04} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial ref={strapMatRef} metalness={0.08} roughness={0.92} roughnessMap={strapTex} bumpMap={strapTex} bumpScale={0.004} clearcoat={0.08} />
          </RoundedBox>
          <RoundedBox position={[0, -0.18, -1.15]} rotation={[-Math.PI / 8, 0, 0]} args={[1.05, 0.09, 1.9]} radius={0.04} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial metalness={0.08} roughness={0.92} roughnessMap={strapTex} bumpMap={strapTex} bumpScale={0.004} clearcoat={0.08} color={watchState.colors.strap} />
          </RoundedBox>
        </group>

        {/* ── Bottom Strap ───────────── */}
        <group position={[0, 0, 1.78]}>
          <RoundedBox args={[1.05, 0.09, 2.4]} radius={0.04} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial metalness={0.08} roughness={0.92} roughnessMap={strapTex} bumpMap={strapTex} bumpScale={0.004} clearcoat={0.08} color={watchState.colors.strap} />
          </RoundedBox>
          <RoundedBox position={[0, -0.18, 1.15]} rotation={[Math.PI / 8, 0, 0]} args={[1.05, 0.09, 1.9]} radius={0.04} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial metalness={0.08} roughness={0.92} roughnessMap={strapTex} bumpMap={strapTex} bumpScale={0.004} clearcoat={0.08} color={watchState.colors.strap} />
          </RoundedBox>
        </group>

      </group>
    </group>
  );
}
