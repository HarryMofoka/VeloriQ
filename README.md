<div align="center">
  <img src="https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/logo.svg" alt="R3F Logo" width="120" />
</div>

<h1 align="center">VeloriQ — Interactive 3D E-Commerce Experience</h1>

<div align="center">
  <strong>A premium, cinematic smart-watch configurator and scroll-driven e-commerce landing page.</strong>
  <br />
  Built with React Three Fiber, GSAP, Framer Motion, and Tailwind CSS.
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-blue.svg?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black.svg?style=for-the-badge&logo=three.js" alt="ThreeJS" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-green.svg?style=for-the-badge&logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Framer_Motion-UI-purple.svg?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<br />

## ❖ Overview

**VeloriQ** is a state-of-the-art interactive front-end application designed to mimic the luxurious, high-end feel of premium hardware brand sites (like Apple or Rolex). It replaces traditional static e-commerce grids with a continuous, buttery-smooth WebGL 3D scroll experience.

As you scroll through the page, a high-fidelity 3D smartwatch organically animates between product states. The watch bands swap materials dynamically, the emissive OLED screens transition through intricate 2D Canvas-drawn interfaces, and the underlying DOM elements seamlessly synchronize with the 3D world timeline via GSAP ScrollTrigger.

---

## ✨ Core Features

* **Real-time 3D Rendering Engine**: Powered by `react-three-fiber` and `three` to render detailed HDR-lit smartwatch geometry at a locked 60+ FPS.
* **Cinematic Scroll Animations**: Utilizing `gsap` and `lenis` smooth scrolling to drive the `useFrame` rendering loop, creating fluid camera tracking and material interpolations.
* **Canvas2D Context Injection**: The smart-watch faces are inherently dynamic. 2D Canvas logic is injected directly into the `CanvasTexture` of the 3D mesh to draw crisp typography, dynamic hands, and glowing elements on-the-fly.
* **Framer Motion Overlay Architecture**: Global UI elements such as the Side Menu, Search Spotlight, and Cart Drawer float independently from the 3D scroll canvas, guaranteeing seamless interactivity without dropping rendering frames or resetting the WebGL context.
* **Zero-Dependency Global State**: A lightweight, robust UI module built atop React 19's `useSyncExternalStore` handles cart management and boolean drawer logic outside of complex component trees.
* **Dynamic International Localization**: Automatically detects the user's IP region to query live exchange rates without API keys, dynamically converting standard numeric `$USD` base-prices into perfectly localized currencies (`£GBP`, `€EUR`, `¥JPY`, etc.) seamlessly inside the UI.
* **Advanced Theming**: A deep, tactical aesthetic defined by custom SVG feTurbulence "leather noise" textures, highly bespoke radial gradients, and fluid typographic hierarchies (`Space Grotesk` & `Inter`).

---

## 🛠️ Tech Stack & Architecture

### **Front-End Technologies**
* **Vite** — HMR driven rapid building and bundling.
* **React 19** — The core view layer.
* **TypeScript** — Strict, robust type-checking across complex 3D ref bounds.
* **Tailwind CSS v4** — Utility-first styling with inline design token extensions.

### **3D & Animation Ecosystem**
* **Three.js** (`three`) — Underlying WebGL wrapper.
* **React Three Fiber** (`@react-three/fiber`) — React renderer for Three.js.
* **Drei** (`@react-three/drei`) — Rich 3D ecosystem helpers (Environment, GLTF loaders).
* **GSAP + ScrollTrigger** (`gsap`) — timeline-based scrolling engine interpolator.
* **Lenis** (`@studio-freight/lenis`) — Buttery continuous scroll integration spanning DOM + Canvas.
* **Framer Motion** (`motion/react`) — Spring physics for UI overlays.

---

## 🏎️ Getting Started

### Prerequisites

You will need **Node.js** (v18 or higher) and **npm** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HarryMofoka/VeloriQ.git
   cd VeloriQ
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```

4. Navigate your browser to `http://localhost:3000`. Hot Module Replacement (HMR) is actively enabled.

---

## 📂 Project Structure

```text
/src
 ├── /assets               # Fonts, 3D glTF models, environment maps
 ├── /components           # Core React UI & 3D Components
 │    ├── CanvasContainer.tsx   # Three.js Environment setup and lighting
 │    ├── WatchModel.tsx        # GLTF parsing, material interpolation, and Screen rendering
 │    ├── HtmlOverlay.tsx       # Scrolling DOM text, headers, triggers
 │    ├── CartDrawer.tsx        # Framer Motion slide-out cart overlay
 │    ├── MenuDrawer.tsx        # Main navigation sliding drawer
 │    ├── SearchModal.tsx       # Live client-side search spotlight
 │    └── UserOverlay.tsx       # Auth mockup overlay
 ├── /lib                  # Utilities and Services
 │    ├── data.ts               # Core product catalog and copy
 │    ├── store.ts              # GSAP mutated global mutation state dict
 │    ├── uiStore.ts            # useSyncExternalStore implementation for drawers/cart
 │    └── usePricing.ts         # Custom Localization hook for API-free IP extraction
 ├── App.tsx               # Primary mounting architecture holding GSAP Lenis
 ├── index.css             # `.premium-panel` noise logic and Tailwind imports
 └── main.tsx              # React DOM entry point
```

---

## 💡 Code Highlights

### The UI Store Engine (`uiStore.ts`)
Instead of prop-drilling or adopting heavy third-party providers like Redux, the UI state is controlled via an incredibly lightweight generic publisher.
```typescript
export function useUIState() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state // SSR fallback
  );
}
```

### 2D to 3D Canvas Injection (`WatchModel.tsx`)
The `CanvasTexture` maintains a precise, decoupled `requestAnimationFrame` drawing cycle independent of standard React updates.
```typescript
  // Memoized specifically to prevent WebGL context loss during Vite HMR
  const screenCanvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    return canvas;
  }, []);
  const screenTexture = useMemo(() => new THREE.CanvasTexture(screenCanvas), [screenCanvas]);
```

---

<div align="center">
  <br />
  <p>Designed and Implemented for purely uncompromised UX.</p>
  <p><b>VeloriQ</b> — Where hardware aesthetic meets digital fluidity.</p>
</div>
