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

/* ── Shared helpers ─────────────────────────────────── */

function drawBackground(ctx: CanvasRenderingContext2D, s: number, cx: number, cy: number) {
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 512);
  bg.addColorStop(0, '#111111');
  bg.addColorStop(0.8, '#080808');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, s, s);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.clip();
}

function accentRgba(color: THREE.Color, a: number): string {
  return `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${a})`;
}

/* ══════════════════════════════════════════════════════
   FACE 1 — LUXURY
   ══════════════════════════════════════════════════════ */
function drawLuxuryFace(ctx: CanvasRenderingContext2D, accent: THREE.Color, t: number, time: string, date: string) {
  const s = 1024, cx = s/2, cy = s/2;
  const hex = '#' + accent.getHexString();
  drawBackground(ctx, s, cx, cy);

  // Edge glow
  const eg = ctx.createRadialGradient(cx, cy, 380, cx, cy, 510);
  eg.addColorStop(0, 'transparent'); eg.addColorStop(1, accentRgba(accent, 0.08));
  ctx.fillStyle = eg; ctx.fillRect(0, 0, s, s);

  // Indices
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(-2.5, -488, 5, 22); }
    else { ctx.beginPath(); ctx.arc(0, -480, 1.5, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill(); }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore();

  // Accent arc
  const af = 0.65 + Math.sin(t*0.8)*0.1;
  ctx.beginPath(); ctx.arc(cx, cy, 494, -Math.PI/2, -Math.PI/2 + af*Math.PI*2);
  ctx.strokeStyle = hex; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';

  // Brand
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '500 26px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('V E L O R I Q', cx, cy - 170);

  // Time
  const [hrs, mins] = time.split(':');
  ctx.fillStyle = '#fff'; ctx.font = '200 260px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(hrs, cx, cy - 20);
  ctx.font = '200 260px "Inter",sans-serif';
  const hw = ctx.measureText(hrs).width;
  ctx.font = '600 100px "Inter",sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(mins, cx + hw/2 + 6, cy - 120);

  // Pulsing colon
  ctx.globalAlpha = 0.3 + Math.abs(Math.sin(t*2))*0.7;
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '300 60px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(':', cx + hw/2 - 4, cy - 85);
  ctx.globalAlpha = 1;

  // Seconds
  const secs = Math.floor(t % 60).toString().padStart(2, '0');
  ctx.fillStyle = hex; ctx.font = '400 40px "Inter",sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(secs, cx + hw/2 + 6, cy - 20);

  // Divider + date
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx-160, cy+80); ctx.lineTo(cx+160, cy+80); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '500 34px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(date, cx, cy + 115);

  // Heart rate
  const hlx = cx-130, hly = cy+240;
  ctx.beginPath(); ctx.arc(hlx, hly, 48, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 3; ctx.stroke();
  const pulse = 0.5+Math.abs(Math.sin(t*3))*0.5;
  ctx.beginPath(); ctx.arc(hlx, hly, 48, -Math.PI/2, -Math.PI/2+pulse*Math.PI*2);
  ctx.strokeStyle = '#ff4757'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = '#ff4757'; ctx.font = '400 26px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('\u2665', hlx, hly-8);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '600 22px "Space Grotesk",sans-serif';
  ctx.fillText(Math.round(72+Math.sin(t*2)*5).toString(), hlx, hly+16);

  // Battery
  const bx = cx, by = cy+270;
  ctx.beginPath(); ctx.arc(bx, by, 36, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(bx, by, 36, -Math.PI/2, -Math.PI/2+0.78*Math.PI*2);
  ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '600 20px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('78%', bx, by+2);

  // Steps
  const srx = cx+130, sry = cy+240;
  ctx.beginPath(); ctx.arc(srx, sry, 48, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.arc(srx, sry, 48, -Math.PI/2, -Math.PI/2+0.42*Math.PI*2);
  ctx.strokeStyle = hex; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '600 22px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('4.2k', srx, sry+6);

  // Second dot
  const sa = -Math.PI/2 + (t%60)*(Math.PI*2/60);
  ctx.fillStyle = hex; ctx.beginPath();
  ctx.arc(cx+Math.cos(sa)*460, cy+Math.sin(sa)*460, 5, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FACE 2 — SPORT (Activity Rings like Apple Watch)
   ══════════════════════════════════════════════════════ */
function drawSportFace(ctx: CanvasRenderingContext2D, accent: THREE.Color, t: number, time: string, date: string) {
  const s = 1024, cx = s/2, cy = s/2;
  const hex = '#' + accent.getHexString();
  drawBackground(ctx, s, cx, cy);

  // Three concentric activity rings
  const ringData = [
    { r: 420, fill: 0.82 + Math.sin(t*0.5)*0.05, color: '#ff3b30', label: 'MOVE', val: '486 CAL' },
    { r: 370, fill: 0.65 + Math.sin(t*0.7)*0.08, color: '#4cd964', label: 'EXERCISE', val: '32 MIN' },
    { r: 320, fill: 0.90 + Math.sin(t*0.3)*0.04, color: '#007aff', label: 'STAND', val: '10 HRS' },
  ];

  ringData.forEach(({ r, fill, color }) => {
    // Track ring
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 28; ctx.stroke();
    // Fill ring
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + fill*Math.PI*2);
    ctx.strokeStyle = color; ctx.lineWidth = 28; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
    // End cap glow
    const ea = -Math.PI/2 + fill*Math.PI*2;
    const glow = ctx.createRadialGradient(cx+Math.cos(ea)*r, cy+Math.sin(ea)*r, 0, cx+Math.cos(ea)*r, cy+Math.sin(ea)*r, 24);
    glow.addColorStop(0, color); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.beginPath();
    ctx.arc(cx+Math.cos(ea)*r, cy+Math.sin(ea)*r, 24, 0, Math.PI*2); ctx.fill();
  });

  // Time — center, bold
  const [hrs, mins] = time.split(':');
  ctx.fillStyle = '#ffffff'; ctx.font = '700 180px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${hrs}:${mins}`, cx, cy - 10);

  // Seconds
  const secs = Math.floor(t % 60).toString().padStart(2, '0');
  ctx.fillStyle = hex; ctx.font = '600 50px "Inter",sans-serif';
  ctx.fillText(secs, cx, cy + 70);

  // Date below
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '500 30px "Space Grotesk",sans-serif';
  ctx.fillText(date, cx, cy + 130);

  // Activity labels at bottom
  ringData.forEach(({ label, val, color }, i) => {
    const lx = cx - 170 + i * 170;
    const ly = cy + 210;
    ctx.fillStyle = color; ctx.font = '600 16px "Space Grotesk",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, ly);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '500 20px "Space Grotesk",sans-serif';
    ctx.fillText(val, lx, ly + 24);
  });

  // HR icon top
  ctx.fillStyle = '#ff3b30'; ctx.font = '400 34px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('\u2665', cx - 100, cy - 180);
  const bpm = Math.round(128 + Math.sin(t*4)*8);
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '600 28px "Space Grotesk",sans-serif';
  ctx.fillText(bpm.toString(), cx - 40, cy - 180);

  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FACE 3 — CLASSIC (Analog-inspired digital)
   ══════════════════════════════════════════════════════ */
function drawClassicFace(ctx: CanvasRenderingContext2D, accent: THREE.Color, t: number, time: string, date: string) {
  const s = 1024, cx = s/2, cy = s/2;
  const hex = '#' + accent.getHexString();
  drawBackground(ctx, s, cx, cy);

  // Elegant outer ring
  ctx.beginPath(); ctx.arc(cx, cy, 490, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2; ctx.stroke();

  // Roman numeral positions
  const romans = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '400 36px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  romans.forEach((num, i) => {
    const angle = -Math.PI/2 + (i * Math.PI * 2 / 12);
    const rx = cx + Math.cos(angle) * 440;
    const ry = cy + Math.sin(angle) * 440;
    ctx.fillText(num, rx, ry);
  });

  // Thin indices between Romans
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      ctx.beginPath(); ctx.moveTo(0, -470); ctx.lineTo(0, -462);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore();

  // Inner decorative circle
  ctx.beginPath(); ctx.arc(cx, cy, 380, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5; ctx.stroke();

  // Brand
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '400 24px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('V E L O R I Q', cx, cy - 120);

  // Time — elegant serif-like
  const [hrs, mins] = time.split(':');
  ctx.fillStyle = '#ffffff'; ctx.font = '100 200px "Inter",sans-serif';
  ctx.fillText(`${hrs}:${mins}`, cx, cy + 30);

  // Date window (right side, like a real watch)
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(cx + 120, cy + 100, 120, 48);
  ctx.strokeStyle = hex; ctx.lineWidth = 1;
  ctx.strokeRect(cx + 120, cy + 100, 120, 48);
  ctx.fillStyle = hex; ctx.font = '600 24px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(date, cx + 180, cy + 124);

  // Accent ring (thin)
  ctx.beginPath(); ctx.arc(cx, cy, 495, -Math.PI/2, -Math.PI/2 + (0.7+Math.sin(t*0.5)*0.1)*Math.PI*2);
  ctx.strokeStyle = hex; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';

  // Sweeping second hand (thin line from center)
  const sa = -Math.PI/2 + (t % 60) * (Math.PI*2/60);
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sa) * 360, cy + Math.sin(sa) * 360);
  ctx.strokeStyle = hex; ctx.lineWidth = 1; ctx.stroke();
  // Center dot
  ctx.fillStyle = hex; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FACE 4 — TACTICAL (Military / HUD style)
   ══════════════════════════════════════════════════════ */
function drawTacticalFace(ctx: CanvasRenderingContext2D, accent: THREE.Color, t: number, time: string, date: string) {
  const s = 1024, cx = s/2, cy = s/2;
  const hex = '#' + accent.getHexString();
  drawBackground(ctx, s, cx, cy);

  // Grid overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
  for (let i = 100; i < s; i += 80) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
  }

  // Concentric range circles
  [200, 300, 400].forEach(r => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5; ctx.stroke();
  });

  // Crosshair lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(cx, cy-500); ctx.lineTo(cx, cy+500); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-500, cy); ctx.lineTo(cx+500, cy); ctx.stroke();

  // Compass heading bar (top)
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(cx-200, 60, 400, 50);
  ctx.strokeStyle = hex; ctx.lineWidth = 1; ctx.strokeRect(cx-200, 60, 400, 50);
  const heading = Math.round((t * 15) % 360);
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  const dirIdx = Math.floor(((heading + 22.5) % 360) / 45);
  ctx.fillStyle = hex; ctx.font = '700 28px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${heading}\u00B0 ${dirs[dirIdx]}`, cx, 85);

  // Time — mono/military style (large, centered)
  const [hrs, mins] = time.split(':');
  const secs = Math.floor(t % 60).toString().padStart(2, '0');
  ctx.fillStyle = hex; ctx.font = '700 200px "Space Grotesk",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${hrs}:${mins}`, cx, cy - 20);

  // Seconds with label
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '600 50px "Space Grotesk",sans-serif';
  ctx.fillText(`:${secs}`, cx + 200, cy - 20);

  // Mission elapsed timer
  const elapsed = Math.floor(t);
  const mh = Math.floor(elapsed / 3600).toString().padStart(2, '0');
  const mm = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
  const ms = (elapsed % 60).toString().padStart(2, '0');
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '400 22px "Space Grotesk",sans-serif';
  ctx.fillText('MISSION ELAPSED', cx, cy + 80);
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '500 30px "Space Grotesk",sans-serif';
  ctx.fillText(`${mh}:${mm}:${ms}`, cx, cy + 115);

  // Date
  ctx.fillText(date, cx, cy + 160);

  // Coordinates (bottom)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '400 18px "Space Grotesk",sans-serif';
  ctx.fillText('26.2041\u00B0 S  28.0473\u00B0 E', cx, cy + 280);

  // Battery + signal (bottom-left, bottom-right)
  ctx.fillStyle = hex; ctx.font = '500 18px "Space Grotesk",sans-serif';
  ctx.textAlign = 'left'; ctx.fillText('BAT 92%', cx - 220, cy + 320);
  ctx.textAlign = 'right'; ctx.fillText('SIG 4/5', cx + 220, cy + 320);

  // Scanning sweep line
  const sweepA = -Math.PI/2 + (t * 0.8) % (Math.PI * 2);
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepA) * 400, cy + Math.sin(sweepA) * 400);
  ctx.strokeStyle = accentRgba(accent, 0.15); ctx.lineWidth = 2; ctx.stroke();

  // Blips on radar
  for (let i = 0; i < 5; i++) {
    const ba = sweepA - 0.3 - i * 0.15;
    const bd = 150 + i * 50;
    const bx = cx + Math.cos(ba) * bd;
    const by = cy + Math.sin(ba) * bd;
    ctx.globalAlpha = 0.5 - i * 0.1;
    ctx.fillStyle = hex; ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FACE 5 — NOIR (Ultra-minimal)
   ══════════════════════════════════════════════════════ */
function drawNoirFace(ctx: CanvasRenderingContext2D, accent: THREE.Color, t: number, time: string, date: string) {
  const s = 1024, cx = s/2, cy = s/2;
  const hex = '#' + accent.getHexString();
  drawBackground(ctx, s, cx, cy);

  // Single thin accent ring
  ctx.beginPath(); ctx.arc(cx, cy, 490, 0, Math.PI*2);
  ctx.strokeStyle = accentRgba(accent, 0.15); ctx.lineWidth = 1; ctx.stroke();

  // Breathing glow ring
  const glow = 0.04 + Math.abs(Math.sin(t * 0.6)) * 0.06;
  const rg = ctx.createRadialGradient(cx, cy, 460, cx, cy, 510);
  rg.addColorStop(0, 'transparent'); rg.addColorStop(1, accentRgba(accent, glow));
  ctx.fillStyle = rg; ctx.fillRect(0, 0, s, s);

  // Only 4 minimal indices at 12, 3, 6, 9
  const positions = [
    { x: cx, y: cy - 460 },   // 12
    { x: cx + 460, y: cy },   // 3
    { x: cx, y: cy + 460 },   // 6
    { x: cx - 460, y: cy },   // 9
  ];
  positions.forEach(p => {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
  });

  // Time — ultra-large, ultra-light weight, perfectly centered
  const [hrs, mins] = time.split(':');
  ctx.fillStyle = '#ffffff'; ctx.font = '100 320px "Inter",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(hrs, cx, cy - 60);

  // Minutes below, slightly bolder
  ctx.fillStyle = accentRgba(accent, 0.9); ctx.font = '300 120px "Inter",sans-serif';
  ctx.fillText(mins, cx, cy + 100);

  // Pulsing separator dot
  ctx.globalAlpha = 0.2 + Math.abs(Math.sin(t * 1.5)) * 0.8;
  ctx.fillStyle = hex; ctx.beginPath(); ctx.arc(cx, cy + 20, 4, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // Date — minimal
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '300 26px "Space Grotesk",sans-serif';
  ctx.fillText(date, cx, cy + 220);

  ctx.restore();
}

/* ── Face dispatcher ────────────────────────────────── */

function drawWatchFace(
  ctx: CanvasRenderingContext2D,
  accentColor: THREE.Color,
  elapsed: number,
  time: string,
  date: string,
  style: string,
) {
  switch (style) {
    case 'sport':    drawSportFace(ctx, accentColor, elapsed, time, date); break;
    case 'classic':  drawClassicFace(ctx, accentColor, elapsed, time, date); break;
    case 'tactical': drawTacticalFace(ctx, accentColor, elapsed, time, date); break;
    case 'noir':     drawNoirFace(ctx, accentColor, elapsed, time, date); break;
    default:         drawLuxuryFace(ctx, accentColor, elapsed, time, date); break;
  }
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

  // Screen canvas (Memoized to prevent HMR context loss)
  const screenCanvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    return canvas;
  }, []);
  const screenTexture = useMemo(() => new THREE.CanvasTexture(screenCanvas), [screenCanvas]);

  useEffect(() => {
    // Canvas sizing is already handled in the useMemo.
    const ctx = screenCanvas.getContext('2d');
    if (ctx) {
      const p = products[0];
      drawWatchFace(ctx, new THREE.Color(p.accentColor), 0, p.screenTime, p.screenDate, p.faceStyle);
      screenTexture.needsUpdate = true;
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

    // Determine current product
    const idx = Math.max(0, Math.min(products.length - 1, Math.round(watchState.progress * (products.length - 1))));
    const p = products[idx];

    // Draw face with the correct style
    const ctx = screenCanvas.getContext('2d');
    if (ctx) {
      drawWatchFace(ctx, watchState.colors.accent, t, p.screenTime, p.screenDate, p.faceStyle);
      screenTexture.needsUpdate = true;
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

        {/* ── Screen ─────────────────── */}
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.36, 64]} />
          <meshStandardMaterial
            map={screenTexture}
            metalness={0}
            roughness={0.08}
            emissive={new THREE.Color(0xffffff)}
            emissiveMap={screenTexture}
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
