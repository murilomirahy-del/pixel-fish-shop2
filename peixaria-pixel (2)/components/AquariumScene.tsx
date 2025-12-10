import React from 'react';
import { PixelButton } from './PixelButton';
import { FISH_TYPES } from '../constants';
import { PixelFish, PixelCloseButton } from './PixelAssets';
import { PlayerState } from '../types';
import { Trophy, CheckCircle } from 'lucide-react';

interface AquariumSceneProps {
    onClose: () => void;
    playerState: PlayerState;
    onDonate: (fishId: string) => void;
}

export const AquariumScene: React.FC<AquariumSceneProps> = ({ onClose, playerState, onDonate }) => {
    
    const donatedCount = playerState.aquarium.length;
    const totalFish = FISH_TYPES.length;
    const progress = Math.floor((donatedCount / totalFish) * 100);
    const inventoryFishIds = Array.from(new Set(playerState.inventory.map(f => f.id)));
    
    const currentBonus = (1 + ((donatedCount / totalFish) * 0.5)).toFixed(2);

    return (
        <div className="absolute inset-2 sm:inset-6 bg-[#1e293b] border-4 border-cyan-800 shadow-2xl flex flex-col font-vt323 z-50 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0f172a] p-3 text-white border-b-4 border-blue-900 z-20 flex justify-between items-center shadow-xl">
                <div>
                    <h1 className="font-pixel text-lg text-cyan-300 flex items-center gap-2">
                        <Trophy className="text-yellow-400" size={20} /> AQUÁRIO
                    </h1>
                    <div className="flex gap-4">
                        <p className="text-xs text-slate-400">Coleção: {donatedCount}/{totalFish} ({progress}%)</p>
                        <p className="text-xs text-green-400 font-bold">Bônus Global: x{currentBonus}</p>
                    </div>
                </div>
                <button onClick={onClose}><PixelCloseButton scale={3}/></button>
            </div>

            {/* Main Tank Area */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                <div className="absolute inset-0 bg-blue-900/20 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 58, 138, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 z-10 relative">
                    {FISH_TYPES.map((fish) => {
                        const isDonated = playerState.aquarium.includes(fish.id);
                        const inInventory = inventoryFishIds.includes(fish.id);

                        return (
                            <div key={fish.id} className={`
                                relative border-4 p-2 flex flex-col items-center justify-between min-h-[120px] bg-opacity-80
                                ${isDonated ? 'bg-cyan-900/50 border-cyan-500' : 'bg-slate-800 border-slate-600'}
                            `}>
                                <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

                                <div className="mt-2 h-12 flex items-center justify-center w-full">
                                    {isDonated ? (
                                        <div className="animate-float"><PixelFish type={fish.id} scale={3} /></div>
                                    ) : (
                                        <div className="opacity-20 grayscale brightness-0"><PixelFish type={fish.id} scale={3} /></div>
                                    )}
                                </div>

                                <div className="w-full text-center z-10">
                                    <p className={`font-bold text-[10px] sm:text-xs truncate ${isDonated ? 'text-cyan-200' : 'text-slate-500'}`}>{isDonated ? fish.name : '???'}</p>
                                    
                                    {isDonated ? (
                                        <div className="mt-1 flex justify-center text-green-400 text-[10px] items-center gap-1 font-pixel"><CheckCircle size={10} /></div>
                                    ) : inInventory ? (
                                        <PixelButton onClick={() => onDonate(fish.id)} color="yellow" className="w-full mt-1 text-[9px] py-0.5 animate-pulse">DOAR</PixelButton>
                                    ) : (
                                        <p className="text-[9px] text-slate-600 mt-1">---</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};