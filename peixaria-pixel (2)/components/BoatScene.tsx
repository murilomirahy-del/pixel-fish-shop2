import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PixelButton } from './PixelButton';
import { CaughtFish, FishType, WeatherType, FishRarity, TimeOfDay, FishingSpotId } from '../types';
import { FISH_TYPES } from '../constants';
import { generateFishermanDialogue } from '../services/geminiService';
import { PixelFish, PixelBoat, PixelCloud, PixelWeatherIcon, PixelBird } from './PixelAssets';
import { audioService } from '../services/audioService';
import { SFX_LIST } from '../audioConstants';

// --- SCENERY ASSETS ---

// Fixed Pixel Tree (Blocky Pine Style)
const PixelTree: React.FC<{ scale?: number; color?: string }> = ({ scale = 4, color = '#166534' }) => {
    return (
        <div className="flex flex-col items-center" style={{ position: 'relative' }}>
            <div style={{ width: scale * 2, height: scale * 2, backgroundColor: color }} />
            <div style={{ width: scale * 4, height: scale * 2, backgroundColor: color }} />
            <div style={{ width: scale * 6, height: scale * 2, backgroundColor: color }} />
             <div style={{ width: scale * 8, height: scale * 2, backgroundColor: color }} />
            <div style={{ width: scale * 2, height: scale * 3, backgroundColor: '#3f2c22' }} />
        </div>
    )
}

const PixelRock: React.FC<{ scale?: number, color?: string }> = ({ scale = 4, color = '#57534e' }) => (
    <div className="flex flex-col items-center">
        <div style={{ width: scale * 3, height: scale, backgroundColor: color }} />
        <div style={{ width: scale * 5, height: scale * 2, backgroundColor: color }} />
    </div>
);

const PixelBush: React.FC<{ scale?: number, color?: string }> = ({ scale = 4, color = '#22c55e' }) => (
    <div className="flex items-end">
        <div style={{ width: scale, height: scale, backgroundColor: color, borderRadius: '2px' }} />
        <div style={{ width: scale * 2, height: scale * 2, backgroundColor: color, borderRadius: '2px' }} />
        <div style={{ width: scale, height: scale, backgroundColor: color, borderRadius: '2px' }} />
    </div>
);

const PixelReed: React.FC<{ scale?: number }> = ({ scale = 3 }) => (
    <div className="flex items-end gap-[2px]">
        <div className="flex flex-col items-center">
             <div style={{ width: scale, height: scale * 1.5, backgroundColor: '#78350f' }} />
             <div style={{ width: scale/2, height: scale * 3, backgroundColor: '#65a30d' }} />
        </div>
        <div className="flex flex-col items-center pb-1">
             <div style={{ width: scale, height: scale * 1.5, backgroundColor: '#78350f' }} />
             <div style={{ width: scale/2, height: scale * 2, backgroundColor: '#65a30d' }} />
        </div>
    </div>
);

// Background Mountain Component
const PixelMountain: React.FC<{ color: string, height: string, width: string, left: string, zIndex?: number }> = ({ color, height, width, left, zIndex = 10 }) => (
    <div 
        className="absolute bottom-0"
        style={{ 
            left, 
            width, 
            height,
            backgroundColor: color,
            zIndex,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' 
        }}
    />
);

interface BoatSceneProps {
  onCatch: (fish: CaughtFish) => void;
  onFail: () => void;
  rodLevel: number;
  inventorySize: number;
  maxInventory: number;
  luckLevel: number;
  weather: WeatherType;
  streak: number;
  timeOfDay: TimeOfDay;
  currentSpot: FishingSpotId;
  isInteractionDisabled: boolean;
}

export const BoatScene: React.FC<BoatSceneProps> = ({ 
  onCatch,
  onFail,
  rodLevel,
  inventorySize,
  maxInventory,
  luckLevel,
  weather,
  streak,
  timeOfDay,
  currentSpot,
  isInteractionDisabled
}) => {
  const [fishingState, setFishingState] = useState<'IDLE' | 'WAITING' | 'HOOKED' | 'FIGHTING' | 'COOLDOWN'>('IDLE');
  const [message, setMessage] = useState("Clique para lançar a linha!");
  const [reactionTimer, setReactionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showingCatch, setShowingCatch] = useState<CaughtFish | null>(null);
  const [isEpicMoment, setIsEpicMoment] = useState(false);
  
  // Fighting State
  const [fightProgress, setFightProgress] = useState(50);
  const [targetFish, setTargetFish] = useState<FishType | null>(null);
  const fightIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Birds Logic
  const [birds, setBirds] = useState<{id: number, top: string, delay: string}[]>([]);
  // Background Swimming Fish Logic
  const [bgFish, setBgFish] = useState<{id: number, top: string, left: string, type: string, animDuration: string, direction: 'left'|'right'}[]>([]);

  useEffect(() => {
      setBirds([
          { id: 1, top: '15%', delay: '0s' },
          { id: 2, top: '25%', delay: '8s' },
          { id: 3, top: '10%', delay: '15s' }
      ]);
      
      // Generate random background fish
      const fish = Array.from({ length: 5 }).map((_, i) => ({
          id: i,
          top: `${Math.random() * 80 + 10}%`, // 10% to 90% height
          left: `${Math.random() * 100}%`,
          type: FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)].id,
          animDuration: `${20 + Math.random() * 20}s`,
          direction: Math.random() > 0.5 ? 'right' : 'left' as const
      }));
      setBgFish(fish);
  }, []);

  const isInventoryFull = inventorySize >= maxInventory;

  // Bubbles
  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${3 + Math.random() * 5}s`,
      size: Math.random() > 0.5 ? 4 : 6,
      opacity: 0.3 + Math.random() * 0.3
    }));
  }, []);

  const raindrops = useMemo(() => {
      if (weather === 'SUNNY') return [];
      const count = weather === 'STORMY' ? 50 : 20;
      return Array.from({ length: count }).map((_, i) => ({
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          duration: `${0.5 + Math.random() * 0.5}s`
      }));
  }, [weather]);

  const startFishing = () => {
    if (isInteractionDisabled) return;
    if (isInventoryFull) {
        audioService.playSFX(SFX_LIST.UI_ERROR);
        setMessage("Inventário cheio! Vá vender.");
        return;
    }
    if (fishingState === 'COOLDOWN') return;

    audioService.playSFX(SFX_LIST.CAST_LINE);
    setFishingState('WAITING');
    setMessage("Aguardando...");
    
    const waitTime = Math.random() * 3000 + 2000;
    
    const timer = setTimeout(() => {
      audioService.playSFX(SFX_LIST.SPLASH);
      setFishingState('HOOKED');
      setMessage("FISGOU! CLIQUE!");
      
      const escapeTimer = setTimeout(() => {
         // Automatically fail if not clicked in time.
         // We don't check fishingState here because startFighting clears this timer.
         failCatch();
      }, 3000); 
      
      setReactionTimer(escapeTimer);

    }, waitTime);
    
    setReactionTimer(timer);
  };

  const failCatch = async (reason?: string) => {
    audioService.playSFX(SFX_LIST.CATCH_FAIL);
    setFishingState('IDLE');
    setTargetFish(null);
    onFail(); 
    if (reactionTimer) clearTimeout(reactionTimer);
    if (fightIntervalRef.current) clearInterval(fightIntervalRef.current);
    
    const msg = reason || await generateFishermanDialogue('NO_CATCH');
    setMessage(msg);
  };

  const determineFish = (): FishType => {
    // --- MYTHIC SPAWN LOGIC ---
    // Reduced base chance from 0.001 to 0.0005 (0.05%)
    // Makes Mythics extremely rare
    let mythicChance = 0.0005; 
    mythicChance += (luckLevel * 0.001); // Reduced luck scaling slightly
    if (weather === 'STORMY') mythicChance += 0.002;

    const mythics = FISH_TYPES.filter(f => f.rarity === FishRarity.MYTHIC && f.location.includes(currentSpot));
    
    if (Math.random() < mythicChance && mythics.length > 0) {
        return mythics[0];
    }

    // --- RARITY ROLL LOGIC ---
    let rollScore = Math.random() * 100 + (rodLevel * 1.5); // Reduced Rod Level scaling on spawn roll
    if (weather === 'RAINY') rollScore += 10;
    if (weather === 'STORMY') rollScore += 25;

    let targetRarity = FishRarity.COMMON;
    
    // Increased thresholds to make high tier fish rarer
    // Was 130 for Legendary, now 160.
    if (rollScore > 160) targetRarity = FishRarity.LEGENDARY;
    else if (rollScore > 95) targetRarity = FishRarity.RARE; // Was 80
    else targetRarity = FishRarity.COMMON;

    const pool = FISH_TYPES.filter(fish => {
        if (fish.rarity !== targetRarity) return false;
        if (!fish.location.includes(currentSpot)) return false;
        // Specific weather logic
        if (fish.id === 'electric_eel') return weather === 'RAINY' || weather === 'STORMY';
        if (fish.id === 'thunder_shark') return weather === 'STORMY';
        if (fish.id === 'anglerfish') return timeOfDay === 'NIGHT';
        return true;
    });

    if (pool.length === 0) {
        // Fallback if no fish of target rarity exists in this spot
        const commonPool = FISH_TYPES.filter(f => f.rarity === FishRarity.COMMON && f.location.includes(currentSpot));
        if (commonPool.length === 0) return FISH_TYPES[0]; 
        return commonPool[Math.floor(Math.random() * commonPool.length)];
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  const startFighting = () => {
    if (reactionTimer) clearTimeout(reactionTimer);
    
    const fish = determineFish();
    setTargetFish(fish);
    setFishingState('FIGHTING');
    setFightProgress(30); 
    setMessage("RESISTA! CLIQUE RAPIDO!");

    const fightDuration = Math.random() * 1000 + 5000;
    const limitTimer = setTimeout(() => {
        failCatch("Escapou! Demorou muito.");
    }, fightDuration);

    setReactionTimer(limitTimer);
  };

  useEffect(() => {
    if (fishingState === 'FIGHTING' && targetFish) {
      let difficultyFactor = targetFish.difficulty; 
      
      // Storm makes it harder now (reduces difficulty value, making drain faster)
      if (weather === 'STORMY') difficultyFactor = Math.max(1, difficultyFactor - 5);
      
      // --- DRAIN MECHANIC ---
      // Formula adjusted for extreme difficulty on Legendary (Diff ~10).
      // If Diff = 10, Drain = (100 - 10) / 25 = 3.6 per tick.
      // 3.6 * 20 ticks = 72 drain per second.
      // Player needs to click to overcome 72 drain.
      const drainRate = (100 - Math.max(difficultyFactor, 1)) / 25; 

      fightIntervalRef.current = setInterval(() => {
        setFightProgress(prev => {
          const newProgress = prev - drainRate;
          if (newProgress <= 0) {
            clearInterval(fightIntervalRef.current!);
            failCatch();
            return 0;
          }
          return newProgress;
        });
      }, 50); // 20 Ticks per second
    }
    return () => { if (fightIntervalRef.current) clearInterval(fightIntervalRef.current); }
  }, [fishingState, targetFish]);

  const handleInteraction = () => {
    if (isInteractionDisabled) return;
    if (fishingState === 'WAITING') {
      audioService.playSFX(SFX_LIST.CATCH_FAIL);
      setFishingState('IDLE');
      if (reactionTimer) clearTimeout(reactionTimer);
      setMessage("Puxou cedo demais!");
      onFail(); 
      return;
    }
    if (fishingState === 'HOOKED') {
      startFighting();
      return;
    }
    if (fishingState === 'FIGHTING') {
      audioService.playSFX(SFX_LIST.REEL_TICK);
      
      // --- REEL POWER MECHANIC ---
      // Reduced base power to make rod upgrades essential.
      // Level 1: 2 + 1.5 = 3.5 per click.
      // To beat 72 drain/sec (Legendary), you need ~20.5 clicks per second.
      const reelPower = 2 + (rodLevel * 1.5); 
      
      setFightProgress(prev => {
        const newProgress = prev + reelPower;
        if (newProgress >= 100) {
          catchSuccess();
          return 100;
        }
        return newProgress;
      });
    }
  };

  const catchSuccess = async () => {
    if (reactionTimer) clearTimeout(reactionTimer);
    if (fightIntervalRef.current) clearInterval(fightIntervalRef.current);
    if (!targetFish) return;

    const newFish: CaughtFish = {
        ...targetFish,
        uniqueId: Math.random().toString(36).substr(2, 9),
        sellStatus: 'CAUGHT',
        qualityMultiplier: 1 
      };

    onCatch(newFish);
    
    if (newFish.rarity === FishRarity.MYTHIC || newFish.rarity === FishRarity.LEGENDARY) {
        triggerEpicScene(newFish);
    } else {
        setShowingCatch(newFish);
    }
    setTargetFish(null);
  };

  const triggerEpicScene = (fish: CaughtFish) => {
    setIsEpicMoment(true);
    setTimeout(() => audioService.playSFX(SFX_LIST.CATCH_SUCCESS), 500);
    setTimeout(() => { setIsEpicMoment(false); setShowingCatch(fish); }, 4000);
  };

  const closeCatchModal = async () => {
    audioService.playSFX(SFX_LIST.UI_CLICK);
    setShowingCatch(null);
    setFishingState('COOLDOWN');
    setMessage("Preparando linha...");
    setTimeout(() => { setFishingState('IDLE'); setMessage("Clique para lançar a linha!"); }, 1000);
  };

  useEffect(() => {
    return () => {
      if (reactionTimer) clearTimeout(reactionTimer);
      if (fightIntervalRef.current) clearInterval(fightIntervalRef.current);
    };
  }, [reactionTimer]);

  // --- ENVIRONMENT LOGIC ---
  const getEnvironmentStyles = () => {
      let skyGradient = '';
      let waterGradient = '';
      let mountainColor = '';
      
      // --- SKY LOGIC (Enhanced Gradients) ---
      if (weather === 'STORMY') {
         // Storm: Dark Grey to Slate
         skyGradient = 'linear-gradient(to bottom, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 100%)';
         mountainColor = '#020617';
         waterGradient = 'linear-gradient(to bottom, #475569 0%, #334155 30%, #1e293b 70%, #0f172a 100%)';
      } else if (weather === 'RAINY') {
         // Rain: Slate to Light Grey
         skyGradient = 'linear-gradient(to bottom, #334155 0%, #475569 40%, #64748b 80%, #94a3b8 100%)';
         mountainColor = '#334155';
         waterGradient = 'linear-gradient(to bottom, #94a3b8 0%, #64748b 30%, #475569 70%, #334155 100%)';
      } else if (timeOfDay === 'NIGHT') {
         // Night: Deep Blue to Lighter Night Blue
         skyGradient = 'linear-gradient(to bottom, #020617 0%, #172554 40%, #1e3a8a 80%, #1e40af 100%)';
         mountainColor = '#020617';
         if (currentSpot === 'RIVER') {
            waterGradient = 'linear-gradient(to bottom, #1e40af 0%, #115e59 40%, #042f2e 100%)'; 
         } else {
            waterGradient = 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 30%, #172554 70%, #020617 100%)'; 
         }
      } else if (timeOfDay === 'AFTERNOON') {
         // Beautiful Sunset: Violet -> Pink -> Orange -> Yellow
         skyGradient = 'linear-gradient(to bottom, #4c1d95 0%, #a21caf 20%, #db2777 40%, #f97316 70%, #fde047 100%)';
         mountainColor = '#581c87'; 
         
         // Water Reflection: Reflects Yellow/Orange at top, fades to deep purple/spot color
         if (currentSpot === 'RIVER') {
            waterGradient = 'linear-gradient(to bottom, #fde047 0%, #fb923c 10%, #15803d 40%, #14532d 100%)'; 
         } else if (currentSpot === 'OCEAN') {
            waterGradient = 'linear-gradient(to bottom, #fde047 0%, #f97316 10%, #c026d3 30%, #1e3a8a 70%, #020617 100%)'; 
         } else {
             waterGradient = 'linear-gradient(to bottom, #fde047 0%, #f97316 15%, #ec4899 40%, #0ea5e9 80%, #0369a1 100%)'; 
         }
      } else {
         // DAY (Sunny): Blue to Light Blue
         skyGradient = 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 25%, #38bdf8 50%, #7dd3fc 75%, #bae6fd 100%)';
         mountainColor = '#0369a1';
         
         if (currentSpot === 'RIVER') {
             // More Emerald/Teal for River
             waterGradient = 'linear-gradient(to bottom, #bae6fd 0%, #34d399 15%, #059669 50%, #064e3b 100%)'; 
         } else if (currentSpot === 'OCEAN') {
             waterGradient = 'linear-gradient(to bottom, #bae6fd 0%, #60a5fa 15%, #3b82f6 50%, #1d4ed8 100%)'; 
         } else {
             waterGradient = 'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 15%, #38bdf8 50%, #0284c7 100%)'; 
         }
      }

      return { skyGradient, waterGradient, mountainColor };
  };

  const envStyles = getEnvironmentStyles();
  
  // Clouds
  const getCloudConfig = () => {
    let color = '#ffffff'; 
    let count = 4;
    if (timeOfDay === 'NIGHT') color = '#312e81';
    if (weather === 'RAINY') { color = '#64748b'; count = 5; }
    else if (weather === 'STORMY') { color = '#475569'; count = 6; }
    else if (timeOfDay === 'AFTERNOON') { color = '#fbcfe8'; } // Pinkish clouds for sunset
    
    return { color, count };
  };
  const cloudConfig = getCloudConfig();

  return (
    <div className={`flex flex-col h-full w-full relative overflow-hidden`} style={{ background: envStyles.skyGradient }}>
      
      {/* Visual Overlays */}
      {isEpicMoment && (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in">
               <h1 className="text-4xl text-purple-400 font-pixel animate-pulse">LENDÁRIO!</h1>
          </div>
      )}

      {showingCatch && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center pt-24 p-4 animate-in fade-in">
             <div className="bg-white border-4 border-black px-8 py-2 mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transform -rotate-1">
                 <h2 className="font-pixel text-black text-3xl animate-pulse">PEGOU!</h2>
             </div>
             <div className="bg-white border-4 border-black p-6 text-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] min-w-[250px] transform rotate-1">
                 <div className="flex justify-center my-4">
                     <PixelFish type={showingCatch.id} scale={6} />
                 </div>
                 <p className="font-bold mt-2 font-pixel text-xl text-black">{showingCatch.name}</p>
                 <p className="text-2xl font-pixel text-green-600 mt-2">${showingCatch.price}</p>
             </div>
             <PixelButton onClick={closeCatchModal} color="green" className="w-48 text-lg">CONTINUAR</PixelButton>
        </div>
      )}

      {streak > 0 && (
          <div className="absolute top-24 right-4 z-40 animate-in slide-in-from-right">
              <div className="bg-yellow-500 border-4 border-black p-2 transform -rotate-2">
                  <p className="font-pixel text-white text-xs">COMBO x{streak}</p>
              </div>
          </div>
      )}

      {weather !== 'SUNNY' && (
          <div className="absolute inset-0 z-20 pointer-events-none opacity-50">
             {raindrops.map((r, i) => (
                 <div key={i} className="absolute bg-blue-200 w-0.5 h-4 opacity-70 animate-[fall_1s_linear_infinite]"
                    style={{ left: r.left, animationDelay: r.delay, animationDuration: r.duration, top: '-20px' }}></div>
             ))}
             {weather === 'STORMY' && <div className="absolute inset-0 bg-white opacity-0 animate-[pulse_5s_ease-in-out_infinite]"></div>}
          </div>
      )}

      {/* SKY */}
      <div className="h-1/3 w-full relative z-0">
        <div className="absolute top-4 right-1/2 transform translate-x-1/2 transition-all duration-1000 z-10">
            {weather === 'SUNNY' && (
                <>
                    {timeOfDay === 'MORNING' && <PixelWeatherIcon type="SUN" scale={5} />}
                    {timeOfDay === 'AFTERNOON' && <PixelWeatherIcon type="SUNSET" scale={5} />}
                    {timeOfDay === 'NIGHT' && <PixelWeatherIcon type="MOON" scale={5} />}
                </>
            )}
        </div>
        
        {/* Clouds */}
        {Array.from({ length: cloudConfig.count }).map((_, i) => (
            <div 
                key={i} 
                className="absolute animate-float" 
                style={{ 
                    top: `${10 + (i * 10)}%`, 
                    right: `${10 + (i * 20)}%`,
                    animationDelay: `${i}s`,
                    opacity: 0.9
                }}
            >
                <PixelCloud scale={3 + (i % 2)} color={cloudConfig.color} />
            </div>
        ))}
        
        {/* Birds (Simple animation) */}
        {weather === 'SUNNY' && birds.map((bird) => (
            <div 
                key={bird.id}
                className="absolute animate-swim-right"
                style={{ top: bird.top, animationDuration: '40s', animationDelay: bird.delay, opacity: 0.8 }}
            >
                <PixelBird scale={1} color={timeOfDay === 'NIGHT' ? '#000' : '#1e3a8a'} />
            </div>
        ))}

        {/* --- SCENERY LAYERS (Mountains/Trees based on Spot) --- */}
        <div className="absolute bottom-0 w-full h-32 z-0 pointer-events-none">
             
             {/* OCEAN HORIZON: Minimalist / No Mountains */}
             {currentSpot === 'OCEAN' && (
                <div className="absolute bottom-0 w-full h-4 opacity-30 bg-blue-900 z-10"></div>
             )}

             {/* RIVER BANK: Complex Forest Scene */}
             {currentSpot === 'RIVER' && (
                 <>
                    {/* Layer 1: Distant Forest Silhouette (Dark) */}
                    <div 
                        className="absolute bottom-4 w-full h-14 opacity-60 z-0"
                        style={{ 
                            backgroundColor: timeOfDay === 'NIGHT' ? '#022c22' : '#052e16',
                            clipPath: 'polygon(0% 100%, 0% 20%, 10% 30%, 20% 10%, 30% 25%, 45% 5%, 60% 20%, 75% 10%, 85% 30%, 100% 15%, 100% 100%)' 
                        }}
                    ></div>

                    {/* Layer 2: Mid-ground Grassy Hills */}
                    <div 
                        className="absolute bottom-2 w-full h-10 z-0"
                        style={{ 
                            backgroundColor: timeOfDay === 'NIGHT' ? '#064e3b' : '#14532d',
                            clipPath: 'ellipse(70% 60% at 50% 100%)' 
                        }}
                    ></div>

                    {/* Layer 3: Main Bank (Ground) */}
                    <div className="absolute bottom-0 w-full h-8 z-10 border-t-4" 
                         style={{ 
                             backgroundColor: timeOfDay === 'NIGHT' ? '#065f46' : '#15803d',
                             borderColor: timeOfDay === 'NIGHT' ? '#064e3b' : '#14532d'
                         }}>
                    </div>

                    {/* Layer 4: Props (Trees, Rocks, Bushes) sitting ON the bank */}
                    
                    {/* Left Group */}
                    <div className="absolute bottom-4 left-[2%] z-10 scale-90"><PixelTree scale={3} color={timeOfDay==='NIGHT' ? '#064e3b' : '#166534'} /></div>
                    <div className="absolute bottom-4 left-[12%] z-10"><PixelRock scale={3} /></div>
                    <div className="absolute bottom-6 left-[18%] z-0"><PixelTree scale={2.5} color={timeOfDay==='NIGHT' ? '#064e3b' : '#15803d'} /></div>
                    <div className="absolute bottom-8 left-[8%] z-10"><PixelBush scale={3} /></div>

                    {/* Right Group */}
                    <div className="absolute bottom-4 right-[5%] z-10 scale-110"><PixelTree scale={4} color={timeOfDay==='NIGHT' ? '#064e3b' : '#166534'} /></div>
                    <div className="absolute bottom-6 right-[20%] z-0"><PixelTree scale={3} color={timeOfDay==='NIGHT' ? '#064e3b' : '#15803d'} /></div>
                    <div className="absolute bottom-6 right-[15%] z-10"><PixelBush scale={4} /></div>
                    <div className="absolute bottom-4 right-[28%] z-10"><PixelRock scale={4} /></div>
                    
                    {/* Water Edge Reeds (Foreground of background) */}
                    <div className="absolute -bottom-2 left-[30%] z-20"><PixelReed scale={3} /></div>
                    <div className="absolute -bottom-2 left-[35%] z-20"><PixelReed scale={2} /></div>
                    <div className="absolute -bottom-2 right-[40%] z-20"><PixelReed scale={3} /></div>
                 </>
             )}

             {/* COAST: Standard Mountains */}
             {currentSpot === 'COAST' && (
                <>
                    <PixelMountain left="-10%" width="50%" height="25%" color={envStyles.mountainColor} zIndex={1} />
                    <PixelMountain left="70%" width="40%" height="30%" color={envStyles.mountainColor} zIndex={1} />
                    <PixelMountain left="20%" width="60%" height="40%" color={envStyles.mountainColor} zIndex={2} />
                </>
             )}
        </div>
      </div>

      {/* BOAT (Positioned absolutely over Sky and Water to avoid clipping) */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 z-20 ${weather === 'STORMY' ? 'animate-[bounce_1s_infinite]' : 'animate-float'}`} 
           style={{ top: '33.33%', marginTop: '-45px' }}>
          <PixelBoat scale={6} />
      </div>

      {/* WATER */}
      <div className={`h-2/3 w-full relative transition-colors duration-1000 overflow-hidden`} style={{ background: envStyles.waterGradient }}>
         {/* Subtle Horizon Line to blend */}
         <div className="absolute top-0 w-full h-2 bg-white opacity-5 mix-blend-overlay"></div>
         
         {/* River Reflections (Horizontal lines) */}
         {currentSpot === 'RIVER' && (
             <>
                <div className="absolute top-4 left-10 w-20 h-1 bg-white opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-20 w-32 h-1 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-12 left-1/3 w-16 h-1 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
             </>
         )}

         {/* Bubbles - More visible */}
         {bubbles.map((b, i) => (
             <div key={i} className="animate-bubble rounded-full bg-white border border-white/40" 
                  style={{ 
                      left: b.left, 
                      width: b.size, 
                      height: b.size, 
                      animationDelay: b.animationDelay, 
                      animationDuration: b.animationDuration,
                      opacity: b.opacity
                   }} 
             />
         ))}

         {/* Background Swimming Fish */}
         {bgFish.map((f, i) => (
             <div 
                key={f.id}
                className={`absolute pointer-events-none opacity-20 ${f.direction === 'right' ? 'animate-swim-right' : 'animate-swim-left'}`}
                style={{ top: f.top, left: f.left, animationDuration: f.animDuration }}
             >
                <PixelFish type={f.type} scale={2} />
             </div>
         ))}
         
         {/* Fishing Line */}
        {(fishingState !== 'IDLE' && fishingState !== 'COOLDOWN') && (
             <div className="absolute top-0 left-1/2 w-0.5 h-20 bg-white origin-top transform rotate-12 z-10 opacity-80" style={{ marginLeft: '10px' }}></div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-0 w-full p-4 pb-20 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center gap-4 z-30 pointer-events-auto">
        
        {fishingState === 'FIGHTING' && (
            <div className="w-full max-w-md mb-2">
                <div className="flex justify-between text-white font-pixel text-xs mb-1">
                    <span>FORÇA DO PEIXE</span>
                    <span>SUA FORÇA</span>
                </div>
                <div className="w-full h-8 bg-black border-2 border-white p-1 relative">
                    <div className="w-full h-full bg-red-900 absolute top-0 left-0 opacity-50"></div>
                    <div 
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 transition-all duration-75 ease-linear"
                        style={{ width: `${fightProgress}%` }}
                    ></div>
                </div>
            </div>
        )}

        <div className="bg-white/95 p-3 border-4 border-black text-center min-w-[280px] shadow-lg">
            <p className="text-sm sm:text-lg font-bold text-black uppercase font-pixel tracking-wide drop-shadow-sm">{message}</p>
        </div>

        {fishingState === 'IDLE' || fishingState === 'COOLDOWN' ? (
             <PixelButton 
                onClick={startFishing} 
                className="w-48 h-16 text-lg tracking-widest shadow-xl text-black font-bold" // Enforced text-black
                disabled={isInventoryFull || fishingState === 'COOLDOWN' || isInteractionDisabled}
                color={isInventoryFull || fishingState === 'COOLDOWN' ? 'gray' : 'green'}
             >
                {isInventoryFull ? 'MOCHILA CHEIA' : fishingState === 'COOLDOWN' ? '...' : 'LANÇAR'}
             </PixelButton>
        ) : (
            <button 
                onMouseDown={handleInteraction}
                onClick={handleInteraction}
                disabled={isInteractionDisabled}
                className={`
                    w-28 h-28 rounded-full border-8 border-white 
                    ${fishingState === 'HOOKED' ? 'bg-red-500 animate-pulse' : 
                      fishingState === 'FIGHTING' ? 'bg-orange-500 active:bg-orange-400 active:scale-90' : 
                      'bg-yellow-400'} 
                    shadow-xl flex items-center justify-center transition-all select-none
                `}
            >
                <span className="font-pixel text-black font-bold text-lg uppercase drop-shadow-md pointer-events-none">
                    {fishingState === 'HOOKED' ? 'FISGOU!' : fishingState === 'FIGHTING' ? 'PUXAR!' : '...'}
                </span>
            </button>
        )}
      </div>
      <style>{`@keyframes fall { to { transform: translateY(80vh); } }`}</style>
    </div>
  );
};