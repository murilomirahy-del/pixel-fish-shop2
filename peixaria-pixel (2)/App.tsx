import React, { useState, useEffect, useRef } from 'react';
import { ViewType, PlayerState, CaughtFish, Mission, WeatherType, MarketTrend, TimeOfDay, FishingSpotId } from './types';
import { BoatScene } from './components/BoatScene';
import { ShopScene } from './components/ShopScene';
import { MapScene } from './components/MapScene';
import { AquariumScene } from './components/AquariumScene';
import { 
  CUSTOMER_BONUS_MULTIPLIER, 
  ROD_UPGRADE_COST, 
  STOCK_UPGRADE_COST, 
  BOAT_UPGRADE_COST,
  MARKETING_UPGRADE_COST,
  BAIT_UPGRADE_COST,
  ICE_UPGRADE_COST,
  LUCK_UPGRADE_COST,
  MAX_INVENTORY_BASE,
  MIN_SELL_TIME,
  MAX_SELL_TIME,
  FISH_TYPES,
  PHASE_DURATION,
  MIN_MARKET_TIME,
  MAX_MARKET_TIME
} from './constants';
import { audioService } from './services/audioService';
import { SFX_LIST, BOAT_PLAYLIST, SHOP_PLAYLIST } from './audioConstants';
import { Volume2, VolumeX, Music, ShoppingCart, Trophy, Map as MapIcon, Fish, Coins, Calendar } from 'lucide-react';
import { PixelWeatherIcon } from './components/PixelAssets';

const SAVE_KEY = 'peixaria_pixel_save_v1';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('FISHING'); // Controls overlays
  const [currentSpot, setCurrentSpot] = useState<FishingSpotId>('COAST');
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongName, setCurrentSongName] = useState(BOAT_PLAYLIST[0]);
  
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const marketTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // --- HELPERS FOR INITIALIZATION ---
  const generateMissions = (day: number): Mission[] => {
    const missions: Mission[] = [];
    missions.push({ id: day * 10 + 1, description: "Pesque 3 peixes", type: 'CATCH', targetAmount: 3, currentAmount: 0, reward: 50 + (day * 10), completed: false, claimed: false });
    const targetFish = FISH_TYPES[Math.floor(Math.random() * 5)]; 
    missions.push({ id: day * 10 + 2, description: `Pesque 1 ${targetFish.name}`, type: 'CATCH', targetId: targetFish.id, targetAmount: 1, currentAmount: 0, reward: targetFish.price * 3, completed: false, claimed: false });
    const targetMoney = 100 + (day * 50);
    missions.push({ id: day * 10 + 3, description: `Ganhe ${targetMoney}$`, type: 'EARN', targetAmount: targetMoney, currentAmount: 0, reward: 100, completed: false, claimed: false });
    return missions;
  };

  const generateMarketTrend = (): MarketTrend => {
      const hotIndex = Math.floor(Math.random() * FISH_TYPES.length);
      let coldIndex = Math.floor(Math.random() * FISH_TYPES.length);
      while (coldIndex === hotIndex) coldIndex = Math.floor(Math.random() * FISH_TYPES.length);
      return { hotFishId: FISH_TYPES[hotIndex].id, coldFishId: FISH_TYPES[coldIndex].id };
  };

  // --- STATE INIT WITH PERSISTENCE ---
  const getInitialState = (): PlayerState => {
      try {
          const savedData = localStorage.getItem(SAVE_KEY);
          if (savedData) {
              const parsed = JSON.parse(savedData);
              // Basic validation/migration: check if critical fields exist
              if (parsed && typeof parsed.money === 'number') {
                  return {
                      ...parsed,
                      // Ensure daily generated fields exist if loading from an older save version
                      missions: parsed.missions || generateMissions(parsed.day || 1),
                      marketTrend: parsed.marketTrend || generateMarketTrend(),
                      catchStreak: parsed.catchStreak || 0
                  };
              }
          }
      } catch (e) {
          console.error("Failed to load save:", e);
      }
      
      // Default State
      return {
        money: 0,
        inventory: [],
        aquarium: [], 
        rodLevel: 1,
        boatLevel: 1,
        stockLevel: 1,
        marketingLevel: 1,
        baitLevel: 1,
        iceLevel: 0,
        luckLevel: 0,
        day: 1,
        weather: 'SUNNY',
        timeOfDay: 'MORNING',
        missions: generateMissions(1),
        marketTrend: generateMarketTrend(),
        catchStreak: 0
      };
  };

  const [playerState, setPlayerState] = useState<PlayerState>(getInitialState);

  // --- AUTO SAVE EFFECT ---
  useEffect(() => {
      const saveData = JSON.stringify(playerState);
      localStorage.setItem(SAVE_KEY, saveData);
  }, [playerState]);

  // --- TIME & WEATHER ---
  const advanceTimeCycle = () => {
    setPlayerState(prev => {
        let nextTime: TimeOfDay = 'MORNING';
        let nextDay = prev.day;
        let nextWeather: WeatherType = 'SUNNY';

        if (prev.timeOfDay === 'MORNING') {
            nextTime = 'AFTERNOON';
            nextWeather = 'SUNNY';
        } else if (prev.timeOfDay === 'AFTERNOON') {
            nextTime = 'NIGHT';
            nextWeather = 'SUNNY';
        } else {
            nextTime = 'MORNING';
            nextDay = prev.day + 1;
            if (Math.random() < 0.5) {
                nextWeather = Math.random() < 0.3 ? 'STORMY' : 'RAINY';
            } else {
                nextWeather = 'SUNNY';
            }
        }
        
        if (prev.timeOfDay !== nextTime) audioService.playSFX(SFX_LIST.SPLASH);

        const updates: Partial<PlayerState> = { timeOfDay: nextTime, day: nextDay, weather: nextWeather };
        if (nextDay !== prev.day) {
             // New Day: New Missions, Reset Streak, BUT Market is independent
             updates.missions = generateMissions(nextDay);
             updates.catchStreak = 0;
             audioService.playSFX(SFX_LIST.LEVEL_UP);
        }
        return { ...prev, ...updates };
    });
    cycleTimerRef.current = setTimeout(advanceTimeCycle, PHASE_DURATION);
  };

  // --- MARKET TREND CYCLE (Independent 5-8 mins) ---
  const updateMarketCycle = () => {
      setPlayerState(prev => ({
          ...prev,
          marketTrend: generateMarketTrend()
      }));
      // Play a subtle sound indicating market shift?
      // audioService.playSFX(SFX_LIST.UI_CLICK); 
      
      const nextDelay = Math.random() * (MAX_MARKET_TIME - MIN_MARKET_TIME) + MIN_MARKET_TIME;
      marketTimerRef.current = setTimeout(updateMarketCycle, nextDelay);
  };

  useEffect(() => {
      // Initialize time cycle
      cycleTimerRef.current = setTimeout(advanceTimeCycle, PHASE_DURATION);
      
      // Initialize Market Cycle
      const initialMarketDelay = Math.random() * (MAX_MARKET_TIME - MIN_MARKET_TIME) + MIN_MARKET_TIME;
      marketTimerRef.current = setTimeout(updateMarketCycle, initialMarketDelay);
      
      return () => { 
          if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current); 
          if (marketTimerRef.current) clearTimeout(marketTimerRef.current);
      };
  }, []);

  // --- AUDIO ---
  const handleInteraction = () => { audioService.init(); };
  const toggleMute = () => { setIsMuted(!!audioService.toggleMute()); };
  const handleNextTrack = () => { setCurrentSongName(audioService.nextTrack()); };

  useEffect(() => {
    // Logic to switch tracks randomly whenever the view changes
    const timer = setTimeout(() => {
        if (activeView === 'SHOP' || activeView === 'AQUARIUM') {
            // Pick a random track from Shop Playlist
            const idx = Math.floor(Math.random() * SHOP_PLAYLIST.length);
            audioService.playMusic('SHOP', idx);
            setCurrentSongName(SHOP_PLAYLIST[idx]);
        } else {
            // Pick a random track from Boat Playlist
            const idx = Math.floor(Math.random() * BOAT_PLAYLIST.length);
            audioService.playMusic('BOAT', idx);
            setCurrentSongName(BOAT_PLAYLIST[idx]);
        }
    }, 50); // Small delay to ensure state transitions smoothly
    return () => clearTimeout(timer);
  }, [activeView]);

  // --- GAMEPLAY HELPERS ---
  const maxInventory = MAX_INVENTORY_BASE + ((playerState.stockLevel - 1) * 3) + ((playerState.boatLevel - 1) * 10);

  const updateMissionProgress = (type: 'CATCH' | 'EARN', amount: number, fishId?: string) => {
      setPlayerState(prev => {
          const newMissions = prev.missions.map(m => {
              if (m.completed) return m;
              if (m.type !== type) return m;
              if (type === 'CATCH' && m.targetId && m.targetId !== fishId) return m;
              const newCurrent = m.currentAmount + amount;
              const isComplete = newCurrent >= m.targetAmount;
              if (isComplete && !m.completed) audioService.playSFX(SFX_LIST.LEVEL_UP);
              return { ...m, currentAmount: newCurrent, completed: isComplete };
          });
          return { ...prev, missions: newMissions };
      });
  };

  const handleClaimMission = (missionId: number) => {
      const mission = playerState.missions.find(m => m.id === missionId);
      if (mission && mission.completed && !mission.claimed) {
          audioService.playSFX(SFX_LIST.SELL_COIN);
          audioService.playSFX(SFX_LIST.UPGRADE);
          setPlayerState(prev => ({ ...prev, money: prev.money + mission.reward, missions: prev.missions.map(m => m.id === missionId ? { ...m, claimed: true } : m) }));
      }
  };

  const handleCatchFish = (fish: CaughtFish) => {
    audioService.playSFX(SFX_LIST.CATCH_SUCCESS);
    setPlayerState(prev => {
        const newStreak = prev.catchStreak + 1;
        const streakBonus = 1 + (newStreak * 0.05);
        const fishWithBonus = { ...fish, qualityMultiplier: streakBonus };
        return { ...prev, catchStreak: newStreak, inventory: [...prev.inventory, fishWithBonus] };
    });
    updateMissionProgress('CATCH', 1, fish.id);
  };

  const handleFailCatch = () => setPlayerState(prev => ({ ...prev, catchStreak: 0 }));

  const handleListFish = (fishId: string) => {
    audioService.playSFX(SFX_LIST.UI_CLICK);
    setPlayerState(prev => {
      let duration = Math.random() * (MAX_SELL_TIME - MIN_SELL_TIME) + MIN_SELL_TIME;
      const speedFactor = 1 - (prev.marketingLevel * 0.05); 
      duration = Math.max(duration * speedFactor, 2000); 
      return { ...prev, inventory: prev.inventory.map(f => f.uniqueId === fishId ? { ...f, sellStatus: 'LISTED', sellReadyTime: Date.now() + duration } : f) };
    });
  };

  const handleCollectMoney = (fishId: string, customerPresent: boolean) => {
    const fish = playerState.inventory.find(f => f.uniqueId === fishId);
    if (!fish) return;
    audioService.playSFX(SFX_LIST.SELL_COIN);
    
    // Base Price calculation
    let finalPrice = fish.price * (1 + (playerState.iceLevel * 0.1));
    finalPrice *= (fish.qualityMultiplier || 1);
    
    // Market Trends
    if (fish.id === playerState.marketTrend.hotFishId) finalPrice *= 1.5;
    else if (fish.id === playerState.marketTrend.coldFishId) finalPrice *= 0.5;
    
    // Customer Bonus
    if (customerPresent) finalPrice *= CUSTOMER_BONUS_MULTIPLIER;
    
    // Aquarium Collection Multiplier (New Logic)
    // Formula: 1 + (Donated Count / Total Fish * 0.5) -> Max 1.5x
    const totalFishTypes = FISH_TYPES.length;
    const donatedCount = playerState.aquarium.length;
    const aquariumMultiplier = 1 + ((donatedCount / totalFishTypes) * 0.5);
    finalPrice *= aquariumMultiplier;

    const earned = Math.floor(finalPrice);
    
    setPlayerState(prev => ({ ...prev, money: prev.money + earned, inventory: prev.inventory.filter(f => f.uniqueId !== fishId) }));
    updateMissionProgress('EARN', earned);
  };

  const handleDiscardFish = (fishId: string) => {
    audioService.playSFX(SFX_LIST.UI_CLICK);
    setPlayerState(prev => ({ ...prev, inventory: prev.inventory.filter(f => f.uniqueId !== fishId) }));
  };

  const handleDonateFish = (fishId: string) => {
      const fish = playerState.inventory.find(f => f.id === fishId);
      if (!fish || playerState.aquarium.includes(fishId)) return;
      audioService.playSFX(SFX_LIST.LEVEL_UP); 
      setPlayerState(prev => {
          const indexToRemove = prev.inventory.findIndex(f => f.id === fishId);
          if (indexToRemove === -1) return prev;
          const newInventory = [...prev.inventory];
          newInventory.splice(indexToRemove, 1);
          return { ...prev, inventory: newInventory, aquarium: [...prev.aquarium, fishId] };
      });
  };

  const checkUpgrade = (cost: number, action: () => void) => {
      if (playerState.money >= cost) { audioService.playSFX(SFX_LIST.UPGRADE); action(); } else audioService.playSFX(SFX_LIST.UI_ERROR);
  };

  // Upgrades
  const upgrades = {
    onRod: () => checkUpgrade(ROD_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - ROD_UPGRADE_COST, rodLevel: prev.rodLevel + 1 }))),
    onStock: () => checkUpgrade(STOCK_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - STOCK_UPGRADE_COST, stockLevel: prev.stockLevel + 1 }))),
    onBoat: () => checkUpgrade(BOAT_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - BOAT_UPGRADE_COST, boatLevel: prev.boatLevel + 1 }))),
    onMarketing: () => checkUpgrade(MARKETING_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - MARKETING_UPGRADE_COST, marketingLevel: prev.marketingLevel + 1 }))),
    onBait: () => checkUpgrade(BAIT_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - BAIT_UPGRADE_COST, baitLevel: prev.baitLevel + 1 }))),
    onIce: () => checkUpgrade(ICE_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - ICE_UPGRADE_COST, iceLevel: prev.iceLevel + 1 }))),
    onLuck: () => checkUpgrade(LUCK_UPGRADE_COST, () => setPlayerState(prev => ({ ...prev, money: prev.money - LUCK_UPGRADE_COST, luckLevel: prev.luckLevel + 1 })))
  };

  // Navigation Logic
  const toggleView = (view: ViewType) => {
      audioService.playSFX(SFX_LIST.UI_CLICK);
      setActiveView(prev => prev === view ? 'FISHING' : view);
  };

  return (
    <div onClick={handleInteraction} className="h-screen w-screen bg-black flex items-center justify-center p-0 md:p-8">
      
      {/* Audio & Status Controls (Top Right) */}
      <div className="fixed top-2 right-2 z-[60] flex items-center gap-2 bg-neutral-800 p-1 rounded border border-neutral-600">
         <div className="text-[10px] text-neutral-400 font-pixel w-20 truncate text-center hidden sm:block">{currentSongName}</div>
         <button onClick={handleNextTrack} className="text-neutral-400 hover:text-white p-1"><Music size={14} /></button>
         <button onClick={toggleMute} className="text-white hover:text-yellow-400 p-1">{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      </div>

      <div className="w-full h-full max-w-4xl max-h-[800px] bg-neutral-800 rounded-xl border-[16px] border-neutral-700 shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* GLOBAL TOP NAVIGATION BAR (HUD) */}
        <div className="absolute top-0 left-0 w-full z-50 flex flex-col">
            {/* Top Bar Decoration */}
            <div className="bg-neutral-600 h-6 flex items-center justify-center">
                 <span className="text-neutral-400 font-pixel text-[10px] tracking-widest">NINTAILWIND</span>
            </div>
            
            {/* Stats & Menu Bar */}
            <div className="bg-black/80 backdrop-blur-sm text-white p-2 flex justify-between items-center border-b-4 border-white/10">
                {/* Left: Stats */}
                <div className="flex gap-3 text-xs font-pixel">
                    <div className="flex items-center gap-1 text-yellow-400"><Coins size={14}/> <span>{Math.floor(playerState.money)}</span></div>
                    <div className="flex items-center gap-1 text-blue-300"><Calendar size={14}/> <span>Dia {playerState.day}</span></div>
                    <div className="flex items-center gap-1"><PixelWeatherIcon type={playerState.weather === 'SUNNY' ? 'SUN' : playerState.weather === 'RAINY' ? 'RAIN' : 'STORM'} scale={1}/></div>
                </div>

                {/* Right: Navigation Buttons */}
                <div className="flex gap-2">
                     <NavButton active={activeView === 'SHOP'} onClick={() => toggleView('SHOP')} icon={<ShoppingCart size={16}/>} label="Loja" color="yellow"/>
                     <NavButton active={activeView === 'AQUARIUM'} onClick={() => toggleView('AQUARIUM')} icon={<Trophy size={16}/>} label="Aquário" color="blue"/>
                     <NavButton active={activeView === 'MAP'} onClick={() => toggleView('MAP')} icon={<MapIcon size={16}/>} label="Mapa" color="red"/>
                </div>
            </div>
        </div>

        {/* MAIN GAME CONTAINER */}
        <div className="flex-1 bg-gray-900 overflow-hidden relative mt-16 sm:mt-12">
            
            {/* BACKGROUND LAYER: FISHING (Always Rendered) */}
            <div className="absolute inset-0 z-0">
                <BoatScene 
                    onCatch={handleCatchFish}
                    onFail={handleFailCatch}
                    rodLevel={playerState.rodLevel + playerState.baitLevel}
                    inventorySize={playerState.inventory.length}
                    maxInventory={maxInventory}
                    luckLevel={playerState.luckLevel}
                    weather={playerState.weather}
                    streak={playerState.catchStreak}
                    timeOfDay={playerState.timeOfDay}
                    currentSpot={currentSpot}
                    isInteractionDisabled={activeView !== 'FISHING'} // Disable fishing when menus are open
                />
            </div>

            {/* OVERLAY LAYERS */}
            {activeView === 'SHOP' && (
                <ShopScene 
                    onClose={() => setActiveView('FISHING')}
                    playerState={playerState}
                    onListFish={handleListFish}
                    onCollectMoney={handleCollectMoney}
                    onDiscardFish={handleDiscardFish}
                    onClaimMission={handleClaimMission}
                    onSetWeather={(w) => setPlayerState(prev => ({...prev, weather: w}))}
                    maxInventory={maxInventory}
                    upgrades={upgrades}
                />
            )}

            {activeView === 'AQUARIUM' && (
                <AquariumScene 
                    onClose={() => setActiveView('FISHING')}
                    playerState={playerState}
                    onDonate={handleDonateFish}
                />
            )}

            {activeView === 'MAP' && (
                <MapScene 
                    onSelectSpot={setCurrentSpot}
                    onClose={() => setActiveView('FISHING')}
                />
            )}
        </div>

        {/* Decorative Side Panel */}
        <div className="absolute top-1/2 left-2 w-2 h-16 bg-red-900 rounded-full border border-red-950 shadow-inner flex flex-col justify-end p-1 z-40">
             <div className="w-full h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(255,0,0,0.8)]"></div>
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'yellow'|'blue'|'red' }> = ({ active, onClick, icon, label, color }) => {
    let activeClass = '';
    let borderClass = '';
    if (color === 'yellow') { activeClass = 'bg-yellow-500'; borderClass = 'border-yellow-700'; }
    if (color === 'blue') { activeClass = 'bg-blue-500'; borderClass = 'border-blue-700'; }
    if (color === 'red') { activeClass = 'bg-red-500'; borderClass = 'border-red-700'; }

    const bg = active ? activeClass : 'bg-gray-700 hover:bg-gray-600';
    const border = active ? borderClass : 'border-gray-900';
    
    return (
        <button onClick={onClick} className={`${bg} border-b-4 ${border} p-1.5 sm:px-3 sm:py-1 text-white flex items-center gap-1 sm:gap-2 transition-all active:translate-y-1 active:border-b-0`}>
            {icon}
            <span className="hidden sm:inline font-pixel text-[10px] uppercase">{label}</span>
        </button>
    )
}

export default App;