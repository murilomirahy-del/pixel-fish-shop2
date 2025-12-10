import React from 'react';

// --- Helper para renderizar matrizes ---
const PixelMatrix: React.FC<{ 
  matrix: number[][]; 
  colors: Record<number, string>; 
  scale?: number;
  className?: string; 
}> = ({ matrix, colors, scale = 4, className = "" }) => {
  return (
    <div className={`inline-flex flex-col ${className}`} style={{ gap: 0 }}>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((val, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: scale,
                height: scale,
                backgroundColor: colors[val] || 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// --- GENERAL ASSETS ---

// Pássaro (Bird) - Formato em V
export const PixelBird: React.FC<{ scale?: number, color?: string }> = ({ scale = 2, color = 'black' }) => {
    const matrix = [
        [1,0,0,0,0,0,1],
        [0,1,0,0,0,1,0],
        [0,0,1,1,1,0,0]
    ];
    const colors = { 1: color };
    return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};

// Generic Cloud
export const PixelCloud: React.FC<{ scale?: number; color?: string; className?: string }> = ({ scale = 4, color = '#cbd5e1', className="" }) => {
  const matrix = [
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 0, 0], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  ];
  const colors: Record<number, string> = { 1: '#ffffff', 2: color }; 
  return <PixelMatrix matrix={matrix} colors={colors} scale={scale} className={className} />;
};

export const PixelBoat: React.FC<{ scale?: number }> = ({ scale = 5 }) => {
  const boatMatrix = [
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0], 
    [2, 0, 6, 5, 0, 0, 3, 0, 0, 7, 7, 7, 0, 0, 2], 
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
  ];

  const colors = {
      1: '#f8fafc', // White Sail
      2: '#854d0e', // Brown Hull
      3: '#451a03', // Dark Mast
      4: '#713f12', // Hull Shading
      5: '#fbbf24', // Hat
      6: '#fca5a5', // Skin
      7: '#94a3b8', // Box
  };

  return <PixelMatrix matrix={boatMatrix} colors={colors} scale={scale} />;
}

// --- Botão X (Fechar) ---
export const PixelCloseButton: React.FC<{ scale?: number }> = ({ scale = 4 }) => {
  const matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];
  const colors = { 1: '#ef4444', 2: '#ffffff' };
  return (
    <div className="hover:scale-110 transition-transform cursor-pointer border-2 border-black">
        <PixelMatrix matrix={matrix} colors={colors} scale={scale} />
    </div>
  );
};

// --- Sol / Lua / Clima ---
export const PixelSun: React.FC<{ scale?: number, colorOverride?: Record<number, string> }> = ({ scale = 4, colorOverride }) => {
  const matrix = [
    [0, 0, 1, 0, 2, 0, 1, 0, 0],
    [0, 0, 0, 2, 2, 2, 0, 0, 0],
    [1, 0, 2, 3, 3, 3, 2, 0, 1],
    [0, 2, 3, 3, 3, 3, 3, 2, 0],
    [2, 2, 3, 3, 3, 3, 3, 2, 2],
    [0, 2, 3, 3, 3, 3, 3, 2, 0],
    [1, 0, 2, 3, 3, 3, 2, 0, 1],
    [0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 1, 0, 2, 0, 1, 0, 0],
  ];
  const defaultColors = { 1: '#fcd34d', 2: '#fbbf24', 3: '#fef3c7' };
  return <PixelMatrix matrix={matrix} colors={colorOverride || defaultColors} scale={scale} />;
};

export const PixelMoon: React.FC<{ scale?: number }> = ({ scale = 4 }) => {
    const matrix = [
        [0,0,0,1,1,1,0,0],
        [0,0,1,1,2,2,1,0],
        [0,1,1,2,0,0,0,0],
        [0,1,1,2,0,0,0,0],
        [0,1,1,2,0,0,0,0],
        [0,1,1,2,0,0,0,0],
        [0,0,1,1,2,2,1,0],
        [0,0,0,1,1,1,0,0],
    ];
    const colors = { 1: '#fef3c7', 2: '#fbbf24' };
    return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};

export const PixelRainCloud: React.FC<{ scale?: number }> = ({ scale = 4 }) => {
    const matrix = [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,2,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,3,0,3,0,3,0,3,0,0], 
        [0,0,3,0,3,0,3,0,0,0],
    ];
    const colors = { 1: '#94a3b8', 2: '#cbd5e1', 3: '#3b82f6' };
    return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};

export const PixelStormCloud: React.FC<{ scale?: number }> = ({ scale = 4 }) => {
    const matrix = [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,2,2,2,2,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,2,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,3,3,0,0,0,0], 
        [0,0,0,3,3,0,0,0,0,0],
        [0,0,3,3,3,3,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0],
    ];
    const colors = { 1: '#475569', 2: '#64748b', 3: '#facc15' };
    return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};

export const PixelWeatherIcon: React.FC<{ type: 'SUN' | 'MOON' | 'SUNSET' | 'RAIN' | 'STORM'; scale?: number }> = ({ type, scale = 4 }) => {
    switch (type) {
      case 'SUN': return <PixelSun scale={scale} />;
      case 'SUNSET': return <PixelSun scale={scale} colorOverride={{1: '#fb923c', 2: '#c2410c', 3: '#fed7aa'}} />;
      case 'MOON': return <PixelMoon scale={scale} />;
      case 'RAIN': return <PixelRainCloud scale={scale} />;
      case 'STORM': return <PixelStormCloud scale={scale} />;
      default: return null;
    }
};

export const PixelCustomer: React.FC<{ scale?: number }> = ({ scale = 5 }) => {
  const matrix = [
    [0, 0, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 3, 1, 3, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 4, 4, 4, 5, 4, 4, 4, 0],
    [4, 4, 5, 5, 5, 5, 5, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
  ];
  const colors = { 1: '#fca5a5', 2: '#1e293b', 3: '#000000', 4: '#3730a3', 5: '#ef4444' };
  return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};

export const PixelFish: React.FC<{ type: string; scale?: number }> = ({ type, scale = 3 }) => {
  let colors: Record<number, string> = {};
  let matrix: number[][] = [];

  switch (type) {
    case 'sardine': // Silver/Grey - Small
        colors = { 1: '#94a3b8', 2: '#475569', 3: '#e2e8f0' };
        matrix = [
            [0,0,1,1,1,0,0,0],
            [1,1,2,2,2,1,0,0],
            [3,1,2,2,2,1,1,1],
            [3,1,1,1,1,1,1,0],
            [0,0,1,1,1,0,0,0]
        ];
        break;

    case 'mackerel': // Blue/Silver stripes
        colors = { 1: '#1e40af', 2: '#e2e8f0', 3: '#1e293b' };
        matrix = [
            [0,0,0,1,1,1,0,0],
            [0,0,1,3,1,3,1,0],
            [0,1,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,1],
            [0,1,1,1,1,1,1,0]
        ];
        break;

    case 'sea_bass': // Greyish Green
        colors = { 1: '#71717a', 2: '#d4d4d8', 3: '#3f3f46' };
        matrix = [
            [0,0,1,1,1,1,0,0],
            [0,1,3,1,1,1,1,0],
            [1,1,2,2,2,2,2,1],
            [1,1,2,2,2,2,2,1],
            [0,1,1,1,1,1,1,0]
        ];
        break;
    
    case 'clownfish': // Orange/White Stripes
        colors = { 1: '#f97316', 2: '#ffffff', 3: '#000000' };
        matrix = [
            [0,0,1,1,1,1,0,0],
            [0,1,1,2,2,1,1,0],
            [1,1,2,2,3,2,1,1],
            [1,1,2,2,3,2,1,1],
            [0,1,1,2,2,1,1,0],
            [0,0,1,1,1,1,0,0]
        ];
        break;

    case 'squid': // Pink - Pointy
        colors = { 1: '#f472b6', 2: '#be185d', 3: '#ffffff' };
        matrix = [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,3,1,3,1,0],
            [0,1,1,1,1,1,1,0],
            [0,1,2,1,1,2,1,0],
            [0,2,0,2,2,0,2,0]
        ];
        break;
    
    case 'puffer': // Yellow - Round/Spiky
        colors = { 1: '#facc15', 2: '#a16207', 3: '#ffffff' };
        matrix = [
            [0,0,2,0,2,0,0,0],
            [0,1,1,1,1,1,0,0],
            [2,1,3,1,3,1,2,0],
            [0,1,1,1,1,1,0,1],
            [2,1,2,1,2,1,2,0],
            [0,1,1,1,1,1,0,0]
        ];
        break;

    case 'crab': // Red - Wide
        colors = { 1: '#ef4444', 2: '#991b1b' };
        matrix = [
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,1,0,0,0,1,1],
            [0,1,1,1,1,1,0],
            [1,1,2,1,2,1,1],
            [1,1,1,1,1,1,1],
            [1,0,1,0,1,0,1]
        ];
        break;

    // --- RIVER ---
    case 'catfish': // Brown - Whiskers
        colors = { 1: '#78350f', 2: '#451a03', 3: '#a8a29e' };
        matrix = [
            [0,0,0,0,0,0,0,0],
            [0,2,0,0,0,0,2,0],
            [0,1,1,1,1,1,1,0],
            [2,1,3,1,1,3,1,2],
            [0,1,1,1,1,1,1,1],
            [0,0,1,1,1,1,0,0]
        ];
        break;

    case 'trout': // Greenish/Brown - Speckles
        colors = { 1: '#65a30d', 2: '#3f6212', 3: '#ecfccb' };
        matrix = [
            [0,0,1,1,1,1,0,0],
            [0,1,2,1,2,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,3,1,2,1,3,1,1],
            [0,1,1,1,1,1,0,0]
        ];
        break;

    case 'tilapia': // Greyish Pink
        colors = { 1: '#d6d3d1', 2: '#a8a29e', 3: '#fda4af' };
        matrix = [
            [0,0,1,1,1,0,0],
            [0,1,2,2,2,1,0],
            [1,2,3,2,2,2,1],
            [1,2,2,2,2,2,1],
            [0,1,1,1,1,1,0]
        ];
        break;

    case 'peacock_bass': // Yellow/Black stripes (Tucunare)
        colors = { 1: '#facc15', 2: '#000000', 3: '#15803d' };
        matrix = [
            [0,0,0,1,1,1,0,0],
            [0,0,1,3,1,3,1,0],
            [0,1,1,2,1,2,1,1],
            [1,1,1,2,1,2,1,1],
            [0,1,1,1,1,1,1,0]
        ];
        break;

    case 'piranha': // Grey/Red belly - Teeth
        colors = { 1: '#94a3b8', 2: '#dc2626', 3: '#ffffff' };
        matrix = [
            [0,0,1,1,1,1,0],
            [0,1,1,3,1,1,0],
            [1,1,1,1,1,1,1],
            [1,2,2,3,3,2,1],
            [0,2,2,2,2,2,0]
        ];
        break;

    case 'salmon': // Pinkish/Orange - Hooked jaw
        colors = { 1: '#fb7185', 2: '#9f1239', 3: '#ffffff' };
        matrix = [
            [0,0,0,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,1,1,1,3,1,1],
            [1,1,1,1,1,1,1,1],
            [0,2,2,2,1,2,2,0],
            [0,0,0,1,1,0,0,0]
        ];
        break;

    case 'electric_eel': // Yellow/Black Zigzag
        colors = { 1: '#facc15', 2: '#000000', 3: '#ffffff' };
        matrix = [
            [0,0,0,1,1,1,2],
            [0,0,1,1,2,2,0],
            [0,1,1,2,2,0,0],
            [1,1,2,2,0,0,0],
            [1,2,2,0,0,0,0],
            [2,2,0,0,0,0,0]
        ];
        break;

    case 'golden_carp': // Gold/Red - Fancy
        colors = { 1: '#f59e0b', 2: '#ef4444', 3: '#fef3c7' };
        matrix = [
            [0,0,2,2,2,0,0],
            [0,1,1,2,1,1,0],
            [1,1,3,1,1,1,1],
            [1,1,1,1,1,3,1],
            [0,1,1,2,1,1,0],
            [0,0,2,2,2,0,0]
        ];
        break;

    // --- OCEAN ---
    case 'shrimp': // Pink - Curved
        colors = { 1: '#fb7185', 2: '#000000' };
        matrix = [
            [0,0,1,1,0,0],
            [0,1,1,1,1,2],
            [1,1,0,0,0,0],
            [1,1,0,0,0,0],
            [0,1,1,1,0,0],
            [0,0,1,0,0,0]
        ];
        break;

    case 'stingray': // Flat Diamond Shape
        colors = { 1: '#4b5563', 2: '#9ca3af', 3: '#000000' };
        matrix = [
            [0,0,0,2,0,0,0],
            [0,0,1,1,1,0,0],
            [0,1,1,1,1,1,0],
            [1,1,1,1,1,1,1],
            [0,0,1,3,1,0,0],
            [0,0,0,3,0,0,0]
        ];
        break;

    case 'swordfish': // Blue - Long nose
        colors = { 1: '#60a5fa', 2: '#1e3a8a', 3: '#ffffff' };
        matrix = [
            [0,0,0,0,0,0,2,0],
            [0,0,0,0,1,1,1,0],
            [0,0,0,1,1,3,1,0],
            [2,2,2,1,1,1,1,2],
            [0,0,0,1,1,1,1,0],
            [0,0,0,0,1,0,0,0]
        ];
        break;
    
    case 'tuna': // Dark Blue - Bullet shape
        colors = { 1: '#1e40af', 2: '#93c5fd', 3: '#ffffff' };
        matrix = [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,3,1,1,0],
            [1,1,2,2,2,2,1,1],
            [0,0,1,1,1,1,0,0]
        ];
        break;
    
    case 'hammerhead': // T-shape head
        colors = { 1: '#475569', 2: '#94a3b8', 3: '#ffffff' };
        matrix = [
            [0,0,2,0,0,0,0,0],
            [1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,0,1,2,1,2,1,1],
            [0,0,1,1,1,1,1,1],
            [0,0,0,1,0,0,0,0]
        ];
        break;

    case 'marlin': // Blue/Stripes - Sail fin
        colors = { 1: '#2563eb', 2: '#172554', 3: '#93c5fd' };
        matrix = [
            [0,0,0,1,1,1,0,0],
            [0,0,1,1,1,1,0,0],
            [0,0,1,1,3,1,0,0],
            [2,2,2,1,1,1,1,2],
            [0,0,1,2,1,2,1,0],
            [0,0,0,1,1,0,0,0]
        ];
        break;

    case 'anglerfish': // Dark - Light bulb
        colors = { 1: '#3f3f46', 2: '#facc15', 3: '#ef4444', 4: '#ffffff' };
        matrix = [
            [0,0,0,0,2,0,0],
            [0,0,0,1,0,0,0],
            [0,0,1,1,1,1,0],
            [0,1,3,1,3,1,0],
            [0,1,1,1,1,1,0],
            [0,0,4,0,4,0,0]
        ];
        break;

    case 'kraken_baby': // Purple/Green - Octopus
        colors = { 1: '#7e22ce', 2: '#4ade80', 3: '#000000' };
        matrix = [
            [0,0,1,1,1,0,0],
            [0,1,1,1,1,1,0],
            [0,1,3,1,3,1,0],
            [1,1,1,1,1,1,1],
            [1,0,1,0,1,0,1],
            [2,0,2,0,2,0,2]
        ];
        break;

    case 'thunder_shark': // Grey + Yellow Lightning
        colors = { 1: '#475569', 2: '#facc15', 3: '#ffffff' };
        matrix = [
            [0,0,0,1,0,0,0,0],
            [0,0,1,1,1,0,0,0],
            [0,1,1,2,1,3,1,0],
            [1,1,1,2,1,1,1,1],
            [0,1,1,2,1,1,0,0],
            [0,0,0,1,0,0,0,0]
        ];
        break;

    case 'golden_turtle': // Mythic Turtle
        colors = { 1: '#facc15', 2: '#166534', 3: '#b45309' };
        matrix = [
            [0,0,0,3,3,3,0,0],
            [0,0,3,1,1,1,3,0],
            [0,2,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1],
            [0,2,0,0,0,0,2,0]
        ];
        break;

    case 'cosmic_leviathan': // Mythic - Galaxy colors
        colors = { 1: '#312e81', 2: '#e879f9', 3: '#ffffff' };
        matrix = [
            [0,0,1,2,1,0,0,0,0],
            [0,1,1,1,1,2,0,0,0],
            [0,1,1,1,1,1,2,0,0],
            [1,1,1,3,1,1,1,1,2],
            [0,1,1,1,1,1,2,0,0],
            [0,1,1,1,1,2,0,0,0],
            [0,0,1,2,1,0,0,0,0]
        ];
        break;

    default: // Generic Fish Fallback
        colors = { 1: '#94a3b8', 2: '#475569' };
        matrix = [
            [0,0,1,1,1,0],
            [0,1,1,1,1,1],
            [1,1,2,1,1,1],
            [1,1,1,1,1,1],
            [0,1,1,1,1,0]
        ];
        break;
  }

  return <PixelMatrix matrix={matrix} colors={colors} scale={scale} />;
};