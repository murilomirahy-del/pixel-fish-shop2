import React, { useState } from 'react';
import { PixelButton } from './PixelButton';
import { FishingSpotId, FishRarity } from '../types';
import { FISH_TYPES } from '../constants';
import { Map as MapIcon, X, Info, Anchor, Compass, Waves, Trees, Sun } from 'lucide-react';
import { PixelCloseButton, PixelFish } from './PixelAssets';

interface MapSceneProps {
    onSelectSpot: (spot: FishingSpotId) => void;
    onClose: () => void;
}

export const MapScene: React.FC<MapSceneProps> = ({ onSelectSpot, onClose }) => {
    const [infoSpot, setInfoSpot] = useState<FishingSpotId | null>(null);

    const spots: { 
        id: FishingSpotId; 
        name: string; 
        desc: string; 
        top: string; 
        left: string; 
        icon: React.ReactNode;
        color: string;
        theme: string;
    }[] = [
        { 
            id: 'COAST', 
            name: 'Costa Ensolarada', 
            desc: 'Águas calmas e peixes coloridos.', 
            top: '55%', 
            left: '25%', 
            icon: <Sun size={28} />, 
            color: 'text-yellow-600',
            theme: 'bg-yellow-50'
        },
        { 
            id: 'RIVER', 
            name: 'Rio da Floresta', 
            desc: 'Correnteza forte e natureza.', 
            top: '25%', 
            left: '50%', 
            icon: <Trees size={28} />, 
            color: 'text-green-700',
            theme: 'bg-green-50'
        },
        { 
            id: 'OCEAN', 
            name: 'Alto Mar', 
            desc: 'Profundezas perigosas.', 
            top: '70%', 
            left: '70%', 
            icon: <Waves size={28} />, 
            color: 'text-blue-700',
            theme: 'bg-blue-50'
        },
    ];

    const getSpotFish = (spotId: FishingSpotId) => {
        return FISH_TYPES.filter(f => f.location.includes(spotId));
    };

    return (
        <div className="absolute inset-2 sm:inset-6 bg-[#271c19] p-3 shadow-2xl flex flex-col font-vt323 z-50 animate-in zoom-in-95 rounded border-4 border-[#1a1210]">
            
            {/* Header / Title Bar */}
            <div className="bg-[#3f2c22] border-b-4 border-[#1a1210] p-2 flex justify-between items-center relative z-20 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="bg-[#eecfa1] p-1 border-2 border-[#5d4037] rounded-sm">
                        <MapIcon className="text-[#5d4037]" size={20} />
                    </div>
                    <h1 className="font-pixel text-lg sm:text-xl text-[#eecfa1] tracking-widest drop-shadow-md uppercase">
                        Carta Náutica
                    </h1>
                </div>
                <button onClick={onClose} className="hover:scale-110 transition-transform">
                    <PixelCloseButton scale={3}/>
                </button>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative overflow-hidden bg-[#eecfa1] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]">
                
                {/* 1. BACKGROUND GEOGRAPHY ART (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 400 300">
                    <defs>
                        <filter id="ink-blur" x="-20%" y="-20%" width="140%" height="140%">
                           <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise"/>
                           <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                        </filter>
                    </defs>

                    {/* Ocean (Bottom Right) - Deep Blue Ink */}
                    <path 
                        d="M 220 300 C 220 200, 280 140, 400 120 V 300 H 220 Z" 
                        fill="#93c5fd" 
                        style={{ filter: 'url(#ink-blur)' }}
                        opacity="0.5"
                    />
                    <path 
                        d="M 240 300 C 240 220, 300 180, 400 150 V 300 H 240 Z" 
                        fill="#60a5fa" 
                        style={{ filter: 'url(#ink-blur)' }}
                        opacity="0.4"
                    />

                    {/* Coast (Left/Center) - Yellow Sand Ink */}
                    <path 
                        d="M 0 100 Q 80 120 120 200 Q 150 280 100 300 H 0 V 100 Z" 
                        fill="#fde68a" 
                        style={{ filter: 'url(#ink-blur)' }}
                        opacity="0.6"
                    />
                    
                    {/* River (Top Center flowing down) - Blue Stream */}
                    <path 
                        d="M 200 0 C 190 40, 230 60, 200 100 C 170 140, 260 220, 300 240" 
                        stroke="#93c5fd" 
                        strokeWidth="12" 
                        fill="none" 
                        strokeLinecap="round"
                        style={{ filter: 'url(#ink-blur)' }}
                        opacity="0.6"
                    />

                    {/* Forest (Top Center surrounding river) - Green patches */}
                    <circle cx="180" cy="40" r="35" fill="#86efac" opacity="0.4" style={{ filter: 'url(#ink-blur)' }} />
                    <circle cx="230" cy="30" r="30" fill="#86efac" opacity="0.4" style={{ filter: 'url(#ink-blur)' }} />
                    <circle cx="200" cy="70" r="25" fill="#86efac" opacity="0.4" style={{ filter: 'url(#ink-blur)' }} />

                </svg>

                {/* 2. Paper Texture / Grid (Overlay on top of map art) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ 
                        backgroundImage: `
                            linear-gradient(#8b4513 1px, transparent 1px), 
                            linear-gradient(90deg, #8b4513 1px, transparent 1px)
                        `, 
                        backgroundSize: '40px 40px' 
                     }}>
                </div>
                
                {/* Decorative Compass */}
                <div className="absolute bottom-6 right-6 opacity-10 pointer-events-none rotate-12 z-0">
                    <Compass size={160} className="text-[#3f2c22]" strokeWidth={1} />
                </div>

                {/* Dashed Path Lines (Navigation Routes) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
                    {/* Coast to River */}
                    <path d="M 25% 55% Q 30% 40% 50% 25%" fill="none" stroke="#5d4037" strokeWidth="2" strokeDasharray="6,4" />
                    {/* River to Ocean */}
                    <path d="M 50% 25% Q 65% 35% 70% 70%" fill="none" stroke="#5d4037" strokeWidth="2" strokeDasharray="6,4" />
                    {/* Coast to Ocean */}
                    <path d="M 25% 55% Q 45% 75% 70% 70%" fill="none" stroke="#5d4037" strokeWidth="2" strokeDasharray="6,4" />
                </svg>

                {/* Map Spots */}
                {spots.map((spot) => (
                    <div 
                        key={spot.id} 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                        style={{ top: spot.top, left: spot.left }}
                        onClick={() => setInfoSpot(spot.id)}
                    >
                        {/* Icon Marker */}
                        <div className={`
                            w-14 h-14 sm:w-20 sm:h-20 
                            bg-white border-4 border-[#3f2c22] 
                            flex items-center justify-center 
                            rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.3)]
                            transition-all duration-300
                            group-hover:-translate-y-2 group-hover:shadow-[6px_10px_0px_rgba(0,0,0,0.2)]
                            group-hover:bg-[#fff8e1]
                            relative overflow-hidden
                        `}>
                            <div className={`absolute inset-0 opacity-10 ${spot.color.replace('text', 'bg')}`}></div>
                            <div className={`${spot.color} group-hover:scale-110 transition-transform duration-300`}>
                                {spot.icon}
                            </div>
                        </div>

                        {/* Label Tag */}
                        <div className="mt-2 bg-[#3f2c22] text-[#eecfa1] px-3 py-1 rounded-sm border-2 border-[#1a1210] shadow-md group-hover:scale-105 transition-transform relative z-20">
                            <span className="font-pixel text-[10px] sm:text-xs uppercase tracking-wide">
                                {spot.name}
                            </span>
                        </div>

                        {/* Quick Action Button (Hover Only) */}
                        <div className="absolute top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                             <PixelButton onClick={(e) => { e.stopPropagation(); onSelectSpot(spot.id); }} color="green" className="text-[10px] py-1 shadow-lg">
                                VIAJAR
                             </PixelButton>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Info */}
            {infoSpot && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-black relative transform rotate-1">
                        
                        {/* Tape strip */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-yellow-200/80 transform -rotate-2 shadow-sm"></div>

                        <button 
                            onClick={() => setInfoSpot(null)} 
                            className="absolute -top-4 -right-4 hover:scale-110 transition-transform bg-white rounded-full p-1 border-2 border-black z-50"
                        >
                            <X className="text-red-500" size={24} />
                        </button>

                        <div className="p-6">
                            <h2 className="font-pixel text-2xl text-black mb-1 border-b-4 border-black pb-2 uppercase text-center">
                                {spots.find(s => s.id === infoSpot)?.name}
                            </h2>
                            <p className="text-center text-gray-600 font-sans italic text-sm mb-4">
                                {spots.find(s => s.id === infoSpot)?.desc}
                            </p>

                            <h3 className="font-pixel text-sm text-black mb-3 bg-gray-200 inline-block px-2">FAUNA LOCAL:</h3>
                            
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto p-1">
                                {getSpotFish(infoSpot).map(fish => (
                                    <div key={fish.id} className="flex flex-col items-center p-2 bg-gray-50 border-2 border-gray-200 hover:border-black transition-colors">
                                        <div className="h-10 flex items-center justify-center mb-1">
                                            <PixelFish type={fish.id} scale={2} />
                                        </div>
                                        <span className="font-pixel text-[8px] sm:text-[10px] text-black text-center leading-tight uppercase w-full truncate">
                                            {fish.name}
                                        </span>
                                        <div className="mt-1">
                                            <span className={`
                                                text-[8px] font-bold px-1.5 rounded text-white font-pixel
                                                ${fish.rarity === FishRarity.COMMON ? 'bg-gray-400' : 
                                                  fish.rarity === FishRarity.RARE ? 'bg-blue-400' : 
                                                  fish.rarity === FishRarity.LEGENDARY ? 'bg-yellow-500' : 'bg-purple-500'}
                                            `}>
                                                {fish.rarity === FishRarity.COMMON ? 'C' : fish.rarity === FishRarity.RARE ? 'R' : fish.rarity === FishRarity.LEGENDARY ? 'L' : 'M'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-100 p-3 border-t-4 border-black flex justify-center">
                             <PixelButton onClick={() => onSelectSpot(infoSpot)} color="green" className="w-full text-lg">
                                 VIAJAR PARA AQUI
                             </PixelButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};