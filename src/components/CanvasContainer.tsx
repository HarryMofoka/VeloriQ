import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera, PresentationControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing';
import { WatchModel } from './WatchModel';
import { watchState } from '../lib/store';
import * as THREE from 'three';

export function CanvasContainer() {
  const ringRef = useRef<THREE.Mesh>(null);

  return (
    <div className="three-canvas">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => { scene.background = null; }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />

        {/* scene.background = null for transparent canvas (gl.alpha handles it) */}

        {/* Glowing ring behind the watch */}
        <mesh ref={ringRef} position={[-1.2, 0, -2]}>
          <ringGeometry args={[2.6, 3.8, 64]} />
          <meshBasicMaterial color="#ffb3b3" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>

        {/* Lights */}
        <ambientLight intensity={0.6} />
        <spotLight position={[8, 8, 8]} angle={0.18} penumbra={1} intensity={1.2} castShadow shadow-mapSize={1024} />
        <spotLight position={[-6, 4, 6]} angle={0.25} penumbra={0.8} intensity={0.4} />
        <pointLight position={[-8, -8, -6]} intensity={0.3} />

        <Environment preset="city" />

        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <WatchModel />
        </PresentationControls>

        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.35}
          scale={12}
          blur={2.5}
          far={5}
        />

        <EffectComposer>
          <N8AO aoRadius={0.8} intensity={1.5} />
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} intensity={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>

        <RingUpdater ringRef={ringRef} />
      </Canvas>
    </div>
  );
}

function RingUpdater({ ringRef }: { ringRef: React.RefObject<THREE.Mesh | null> }) {
  useFrame((state) => {
    if (!ringRef.current) return;
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.color.copy(watchState.colors.circle);
    // Follow watch position
    ringRef.current.position.x = watchState.position.x;
    ringRef.current.position.y = watchState.position.y;
    // Subtle breathing
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.06;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
    ringRef.current.scale.setScalar(s);
  });
  return null;
}
