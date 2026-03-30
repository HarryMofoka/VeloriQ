import * as THREE from 'three';
import { products } from './data';

const p0 = products[0];

export const watchState = {
  rotation: new THREE.Euler(0.1, -0.3, 0),
  position: new THREE.Vector3(-1.2, 0, 0),
  scale: new THREE.Vector3(1, 1, 1),
  colors: {
    case: new THREE.Color(p0.caseColor),
    strap: new THREE.Color(p0.strapColor),
    accent: new THREE.Color(p0.accentColor),
    bg: new THREE.Color(p0.bgColor),
    circle: new THREE.Color(p0.circleColor),
    backdrop: new THREE.Color(p0.backdropColor),
  },
  progress: 0,
};
