export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: string;
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
    name: 'FOSSIL',
    subtitle: 'Super Luxury',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed diam nonumy eirmod tempor.',
    price: '$399',
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
    name: 'FOSSIL',
    subtitle: 'Sport Active',
    description: 'Lightweight aluminum case and silicone strap designed for your toughest workouts.',
    price: '$299',
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
    name: 'FOSSIL',
    subtitle: 'Classic Elegance',
    description: 'Stainless steel finish with a minimalist digital face respecting traditional craft.',
    price: '$449',
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
    name: 'FOSSIL',
    subtitle: 'Tactical Stealth',
    description: 'Matte finish with military-grade durability and extended battery life.',
    price: '$349',
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
    name: 'FOSSIL',
    subtitle: 'Midnight Noir',
    description: 'Pure black ceramic with sapphire crystal glass. Understated luxury redefined.',
    price: '$549',
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
