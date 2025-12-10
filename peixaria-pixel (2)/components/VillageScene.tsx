import React from 'react';
import { PixelButton } from './PixelButton';
import { Store, Anchor, Fish, MapPin } from 'lucide-react';
import { PixelWeatherIcon } from './PixelAssets';
import { TimeOfDay, WeatherType } from '../types';

interface VillageSceneProps {
    onGoToShop: () => void;
    onGoToMap: () => void;
    onGoToAquarium: () => void;
    day: number;
    money: number;
    timeOfDay: TimeOfDay;
    weather: WeatherType;
}

// Simple Pixel House Component
const PixelHouse: React.FC<{ color: string, scale?: number }> = ({ color, scale = 4 }) => {
    return (
        <div className="flex flex-col items-center relative">
            {/* Roof */}
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-transparent border-b-red-700 transform scale-150 mb-[-2px]" style={{ borderBottomColor: '#7f1d1d' }}></div>
            {/* Body */}
            <div className={`w-12 h-10 ${color} border-4 border-black flex justify-center items-end`}>
                <div className="w-4 h-6 bg-black"></div>
            </div>
        </div>
    );
};

export const VillageScene: React.FC<VillageSceneProps> = ({ 
    onGoToShop, 
    onGoToMap, 
    onGoToAquarium,
    day,
    money,
    timeOfDay,
    weather
}) => {
    
    // Background based on time
    const bgClass = timeOfDay === 'NIGHT' ? 'bg-slate-900' : 'bg-[#86efac]'; // Dark at night, Grass green at day
    const skyClass = timeOfDay === 'NIGHT' ? 'bg-indigo-950' : weather === 'STORMY' ? 'bg-slate-700' : 'bg-sky-300';

    return (
        <div className={`h-full w-full flex flex-col relative font-vt323 overflow-hidden transition-colors duration-1000`}>
            
            {/* SKY */}
            <div className={`h-1/3 w-full ${skyClass} relative p-4`}>
                 <div className="flex justify-between items-start text-white drop-shadow-md">
                     <div className="flex flex-col">
                        <h1 className="font-pixel text-2xl text-yellow-300">Vila do Pescador</h1>
                        <p className="text-sm">Dia {day}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xl text-yellow-400 font-bold">${Math.floor(money)}</span>
                     </div>
                 </div>

                 {/* Weather Icon in Sky */}
                 <div className="absolute top-4 right-1/2 transform translate-x-1/2">
                    {timeOfDay === 'MORNING' && weather === 'SUNNY' && <PixelWeatherIcon type="SUN" scale={4} />}
                    {timeOfDay === 'AFTERNOON' && weather === 'SUNNY' && <PixelWeatherIcon type="SUNSET" scale={4} />}
                    {timeOfDay === 'NIGHT' && <PixelWeatherIcon type="MOON" scale={4} />}
                    {weather === 'RAINY' && <PixelWeatherIcon type="RAIN" scale={4} />}
                    {weather === 'STORMY' && <PixelWeatherIcon type="STORM" scale={4} />}
                 </div>
            </div>

            {/* LAND */}
            <div className={`h-2/3 w-full ${bgClass} relative border-t-8 border-[#14532d]`}>
                
                {/* Roads */}
                <div className="absolute top-0 left-1/2 w-16 h-full bg-[#d6d3d1] transform -translate-x-1/2 border-l-4 border-r-4 border-[#a8a29e]"></div>
                <div className="absolute top-1/2 left-0 w-full h-12 bg-[#d6d3d1] transform -translate-y-1/2 border-t-4 border-b-4 border-[#a8a29e]"></div>

                {/* LOCATIONS */}
                
                {/* 1. SHOP (Left) */}
                <button 
                    onClick={onGoToShop}
                    className="absolute top-10 left-4 sm:left-10 flex flex-col items-center group hover:scale-110 transition-transform z-10"
                >
                    <div className="bg-white border-4 border-black p-2 mb-2 shadow-lg group-hover:bg-yellow-100">
                        <Store size={32} className="text-orange-600" />
                    </div>
                    <div className="bg-orange-700 text-white px-2 py-1 font-pixel text-xs border-2 border-black">
                        LOJA
                    </div>
                </button>

                {/* 2. AQUARIUM (Right) */}
                <button 
                    onClick={onGoToAquarium}
                    className="absolute top-10 right-4 sm:right-10 flex flex-col items-center group hover:scale-110 transition-transform z-10"
                >
                    <div className="bg-blue-200 border-4 border-black p-2 mb-2 shadow-lg group-hover:bg-blue-100">
                        <Fish size={32} className="text-blue-600" />
                    </div>
                    <div className="bg-blue-700 text-white px-2 py-1 font-pixel text-xs border-2 border-black">
                        AQUÁRIO
                    </div>
                </button>

                {/* 3. DOCKS (Bottom Center) */}
                <button 
                    onClick={onGoToMap}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center group hover:scale-110 transition-transform z-20"
                >
                    <div className="bg-amber-100 border-4 border-black p-3 mb-2 shadow-lg group-hover:bg-white">
                         <Anchor size={40} className="text-red-600" />
                    </div>
                    <div className="bg-red-600 text-white px-4 py-1 font-pixel text-sm border-2 border-black animate-pulse">
                        PESCAR
                    </div>
                </button>

                {/* Decor Houses */}
                <div className="absolute bottom-20 left-10 opacity-80 pointer-events-none">
                    <PixelHouse color="bg-yellow-200" />
                </div>
                <div className="absolute bottom-20 right-10 opacity-80 pointer-events-none">
                    <PixelHouse color="bg-purple-200" />
                </div>

            </div>
        </div>
    );
}
