export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number;
  caseColor: string;
  strapColor: string;
  accentColor: string;
  bgColor: string;
  circleColor: string;
  backdropColor: string;
  screenTime: string;
  screenDate: string;
  faceStyle: 'luxury' | 'sport' | 'classic' | 'tactical' | 'noir';
  watchSide: 'left' | 'right';
}

export const products: Product[] = [
  {
    id: 1,
    name: 'VeloriQ',
    subtitle: 'Super Luxury',
    description: 'Meticulously crafted from aerospace-grade titanium and domed sapphire crystal. The absolute pinnacle of modern horology and uncompromising design.',
    basePrice: 599,
    caseColor: '#1a1a1a',
    strapColor: '#0e0e0e',
    accentColor: '#ff6b6b',
    bgColor: '#161616',
    circleColor: '#ffb3b3',
    backdropColor: '#8b6f5c',
    screenTime: '12:38',
    screenDate: 'WED 8/7',
    faceStyle: 'luxury',
    watchSide: 'left',
  },
  {
    id: 2,
    name: 'VeloriQ',
    subtitle: 'Sport Active',
    description: 'Ultra-lightweight aluminum chassis engineered perfectly with a breathable fluoroelastomer band. Ready to conquer your toughest elements.',
    basePrice: 399,
    caseColor: '#2a2a2a',
    strapColor: '#d4844a',
    accentColor: '#e67e22',
    bgColor: '#1a1814',
    circleColor: '#e8a87c',
    backdropColor: '#c4956a',
    screenTime: '10:56',
    screenDate: 'THU 3/7',
    faceStyle: 'sport',
    watchSide: 'right',
  },
  {
    id: 3,
    name: 'VeloriQ',
    subtitle: 'Classic Elegance',
    description: 'Timeless artisan craftsmanship meets cutting-edge technology. Hand-polished stainless steel housing an elegant, minimalist digital face.',
    basePrice: 449,
    caseColor: '#c8c8c8',
    strapColor: '#a0a0a0',
    accentColor: '#5dade2',
    bgColor: '#111822',
    circleColor: '#8bbfe0',
    backdropColor: '#4a6a8a',
    screenTime: '09:24',
    screenDate: 'MON 1/12',
    faceStyle: 'classic',
    watchSide: 'left',
  },
  {
    id: 4,
    name: 'VeloriQ',
    subtitle: 'Tactical Stealth',
    description: 'Built for the shadows. Military-spec durability finished in a matte DLC coating. Equipped with advanced radar navigation and mission timer tracking.',
    basePrice: 499,
    caseColor: '#2c3e50',
    strapColor: '#1a5c32',
    accentColor: '#2ecc71',
    bgColor: '#0f1a14',
    circleColor: '#7dcea0',
    backdropColor: '#3d6b4f',
    screenTime: '14:07',
    screenDate: 'SAT 5/3',
    faceStyle: 'tactical',
    watchSide: 'right',
  },
  {
    id: 5,
    name: 'VeloriQ',
    subtitle: 'Midnight Noir',
    description: 'Forged entirely from pure black ceramic. A powerful, understated statement of minimalist perfection that breathes quietly on your wrist.',
    basePrice: 699,
    caseColor: '#0d0d0d',
    strapColor: '#151515',
    accentColor: '#a855f7',
    bgColor: '#0d0d14',
    circleColor: '#c084fc',
    backdropColor: '#5a3d7a',
    screenTime: '22:15',
    screenDate: 'FRI 11/8',
    faceStyle: 'noir',
    watchSide: 'left',
  },
];
