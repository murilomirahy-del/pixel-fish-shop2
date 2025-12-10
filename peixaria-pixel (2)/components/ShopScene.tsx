import React, { useState, useEffect } from 'react';
import { PixelButton } from './PixelButton';
import { PlayerState, WeatherType } from '../types';
import { 
    CUSTOMER_BONUS_MULTIPLIER, 
    ROD_UPGRADE_COST, 
    STOCK_UPGRADE_COST,
    BOAT_UPGRADE_COST,
    MARKETING_UPGRADE_COST,
    BAIT_UPGRADE_COST,
    ICE_UPGRADE_COST,
    LUCK_UPGRADE_COST,
    FISH_TYPES
} from '../constants';
import { generateFishermanDialogue, generateCustomerGossip } from '../services/geminiService';
import { Coins, Fish, Store, Timer, Snowflake, Bug, Trash2, Box, Clover, CheckSquare, TrendingUp, TrendingDown, Anchor } from 'lucide-react';
import { PixelCustomer, PixelFish, PixelCloseButton } from './PixelAssets';

const PixelFisherman: React.FC<{ scale?: number }> = ({ scale = 5 }) => {
  const matrix = [
    [0, 0, 0, 3, 3, 3, 3, 3, 0, 0], 
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 0], 
    [0, 0, 3, 1, 1, 1, 1, 3, 0, 0], 
    [0, 0, 1, 4, 1, 1, 4, 1, 0, 0], 
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0], 
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0], 
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0], 
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0], 
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0], 
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], 
  ];
  const colors: Record<number, string> = {1: '#fca5a5', 2: '#ffffff', 3: '#fbbf24', 4: '#000000'};

  return (
    <div className="inline-flex flex-col" style={{ gap: 0 }}>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((val, colIndex) => (
            <div key={colIndex} style={{ width: scale, height: scale, backgroundColor: colors[val] || 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
};

interface ShopSceneProps {
  onClose: () => void;
  playerState: PlayerState;
  onListFish: (fishId: string) => void;
  onCollectMoney: (fishId: string, customerBonus: boolean) => void;
  onDiscardFish: (fishId: string) => void;
  onClaimMission: (missionId: number) => void;
  onSetWeather: (w: WeatherType) => void;
  maxInventory: number;
  upgrades: {
    onRod: () => void;
    onStock: () => void;
    onBoat: () => void;
    onMarketing: () => void;
    onBait: () => void;
    onIce: () => void;
    onLuck: () => void;
  }
}

export const ShopScene: React.FC<ShopSceneProps> = ({
  onClose,
  playerState,
  onListFish,
  onCollectMoney,
  onDiscardFish,
  onClaimMission,
  maxInventory,
  upgrades
}) => {
  const [customerPresent, setCustomerPresent] = useState(false);
  const [customerTimer, setCustomerTimer] = useState(0);
  const [npcDialogue, setNpcDialogue] = useState("Bem-vindo à Peixaria!");
  const [customerQuote, setCustomerQuote] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const hotFish = FISH_TYPES.find(f => f.id === playerState.marketTrend.hotFishId);
  const coldFish = FISH_TYPES.find(f => f.id === playerState.marketTrend.coldFishId);

  // Aquarium Multiplier Calculation
  const totalFishTypes = FISH_TYPES.length;
  const donatedCount = playerState.aquarium.length;
  const aquariumMultiplier = 1 + ((donatedCount / totalFishTypes) * 0.5);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generateFishermanDialogue('WELCOME').then(setNpcDialogue);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!customerPresent) {
        const chance = 0.1 + (playerState.marketingLevel * 0.01);
        if (Math.random() < chance) {
          spawnCustomer();
        }
      } else {
        setCustomerTimer((prev) => {
          if (prev <= 1) {
            setCustomerPresent(false);
            setCustomerQuote("");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [customerPresent, playerState.marketingLevel]);

  const spawnCustomer = async () => {
    setCustomerPresent(true);
    setCustomerTimer(15);
    const quote = await generateCustomerGossip();
    setCustomerQuote(quote);
  };

  return (
    <div className="absolute inset-2 sm:inset-6 bg-orange-100 border-4 border-black shadow-2xl flex flex-col font-vt323 z-50 animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="bg-orange-800 text-white p-2 border-b-4 border-black flex justify-between items-center">
        <h1 className="font-pixel text-lg text-yellow-300 flex items-center gap-2"><Store/> LOJA</h1>
        <button onClick={onClose}><PixelCloseButton scale={3}/></button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: NPC, Missions & Customer */}
        <div className="w-full md:w-1/3 bg-orange-200 p-2 md:p-4 border-b-4 md:border-b-0 md:border-r-4 border-orange-900 flex flex-col overflow-y-auto">
           
           {/* NPC Area */}
           <div className="bg-amber-900 p-2 mb-2 border-4 border-black rounded relative">
              <div className="bg-black p-2 mb-2 min-h-[40px] flex items-center justify-center text-center">
                 <p className="text-green-400 font-pixel text-[10px] leading-4">"{npcDialogue}"</p>
              </div>
              <div className="flex justify-center">
                 <PixelFisherman scale={6} />
              </div>
           </div>

           {/* MARKET TRENDS */}
           <div className="mb-2 bg-gray-200 border-4 border-gray-600 p-1">
                <div className="flex justify-between items-center text-[10px]">
                    <div className="flex-1 flex flex-col items-center p-1 bg-red-100 border border-red-300 mr-1">
                        <TrendingUp size={12} className="text-red-500" />
                        <span className="font-bold text-red-800">ALTA x1.5</span>
                        <span className="text-black truncate w-full text-center">{hotFish?.name}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center p-1 bg-blue-100 border border-blue-300 ml-1">
                        <TrendingDown size={12} className="text-blue-500" />
                        <span className="font-bold text-blue-800">BAIXA x0.5</span>
                        <span className="text-black truncate w-full text-center">{coldFish?.name}</span>
                    </div>
                </div>
           </div>

           {/* MISSIONS */}
           <div className="bg-yellow-100 border-4 border-yellow-700 p-1 mb-2 shadow-sm flex-1 overflow-y-auto min-h-[100px]">
                <div className="flex items-center gap-1 mb-1 border-b-2 border-yellow-700 pb-1">
                    <CheckSquare className="text-yellow-800" size={14} />
                    <h3 className="font-pixel text-[10px] text-yellow-900 uppercase">Missões</h3>
                </div>
                <div className="space-y-1">
                    {playerState.missions.map(m => (
                        <div key={m.id} className={`p-1 border ${m.completed ? 'bg-green-200 border-green-500' : 'bg-white border-yellow-500'}`}>
                            <p className="text-[10px] font-bold leading-tight flex justify-between">
                                <span>{m.description}</span>
                                {m.completed && !m.claimed && (
                                    <button onClick={() => onClaimMission(m.id)} className="bg-green-500 text-white px-1 ml-1 animate-bounce">
                                        ${m.reward}
                                    </button>
                                )}
                            </p>
                            <div className="w-full h-1 bg-gray-200 mt-0.5">
                                <div className="h-full bg-blue-500" style={{ width: `${Math.min((m.currentAmount / m.targetAmount) * 100, 100)}%`}} />
                            </div>
                        </div>
                    ))}
                </div>
           </div>
        </div>

        {/* Right: Upgrades & Inventory */}
        <div className="w-full md:w-2/3 p-2 md:p-4 overflow-y-auto bg-stone-100">
            
            {/* UPGRADES */}
            <div className="mb-4 border-4 border-black bg-white p-2">
                <h2 className="font-pixel text-sm mb-2 flex items-center gap-2 text-black"><Store size={16} /> Melhorias</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <UpgradeCard icon={<Anchor size={12}/>} name={`Vara ${playerState.rodLevel}`} cost={ROD_UPGRADE_COST} onClick={upgrades.onRod} money={playerState.money} />
                    <UpgradeCard icon={<Box size={12}/>} name={`Estoque ${playerState.stockLevel}`} cost={STOCK_UPGRADE_COST} onClick={upgrades.onStock} money={playerState.money} />
                    {playerState.rodLevel > 1 && <UpgradeCard icon={<Store size={12}/>} name={`Barco ${playerState.boatLevel}`} cost={BOAT_UPGRADE_COST} onClick={upgrades.onBoat} money={playerState.money} />}
                    {playerState.stockLevel > 1 && <UpgradeCard icon={<Timer size={12}/>} name={`Ads ${playerState.marketingLevel}`} cost={MARKETING_UPGRADE_COST} onClick={upgrades.onMarketing} money={playerState.money} />}
                    {playerState.rodLevel > 2 && <UpgradeCard icon={<Bug size={12}/>} name={`Isca ${playerState.baitLevel}`} cost={BAIT_UPGRADE_COST} onClick={upgrades.onBait} money={playerState.money} />}
                    {playerState.boatLevel > 1 && <UpgradeCard icon={<Snowflake size={12}/>} name={`Gelo ${playerState.iceLevel}`} cost={ICE_UPGRADE_COST} onClick={upgrades.onIce} money={playerState.money} />}
                    {playerState.boatLevel > 2 && <UpgradeCard icon={<Clover size={12}/>} name={`Sorte ${playerState.luckLevel}`} cost={LUCK_UPGRADE_COST} onClick={upgrades.onLuck} money={playerState.money} />}
                </div>
            </div>

            {/* INVENTORY */}
            <div className="border-4 border-black bg-white min-h-[200px] flex flex-col">
                <div className="bg-blue-800 text-white p-1 px-2 flex justify-between items-center">
                    <h2 className="font-pixel text-xs flex items-center gap-2">
                        <Fish size={14} /> Estoque ({playerState.inventory.length}/{maxInventory})
                    </h2>
                </div>

                <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {playerState.inventory.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-400 text-xs">Vazio...</div>
                    )}
                    
                    {playerState.inventory.map((fish) => {
                        const isListed = fish.sellStatus === 'LISTED';
                        const isReady = fish.sellStatus === 'LISTED' && fish.sellReadyTime && currentTime > fish.sellReadyTime;
                        let displayPrice = Math.floor(fish.price * (1 + (playerState.iceLevel * 0.1)));
                        displayPrice = Math.floor(displayPrice * (fish.qualityMultiplier || 1));
                        if (fish.id === hotFish?.id) displayPrice = Math.floor(displayPrice * 1.5);
                        if (fish.id === coldFish?.id) displayPrice = Math.floor(displayPrice * 0.5);
                        if (customerPresent && isReady) displayPrice = Math.floor(displayPrice * CUSTOMER_BONUS_MULTIPLIER);
                        
                        // Apply Aquarium Bonus
                        displayPrice = Math.floor(displayPrice * aquariumMultiplier);

                        return (
                            <div key={fish.uniqueId} className={`border-2 border-black p-1 flex flex-col items-center justify-between min-h-[100px] relative ${isReady ? 'bg-green-100' : 'bg-blue-50'}`}>
                                <div className="absolute top-0 right-0">
                                     <button onClick={() => onDiscardFish(fish.uniqueId)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={10} /></button>
                                </div>
                                <div className="mt-1"><PixelFish type={fish.id} scale={3} /></div>
                                <span className="font-bold text-black text-[10px] mt-1 text-center leading-tight">{fish.name}</span>
                                {fish.sellStatus === 'CAUGHT' && (
                                    <button onClick={() => onListFish(fish.uniqueId)} className="w-full bg-yellow-400 text-black text-[10px] py-0.5 mt-1 border border-black hover:bg-yellow-300">
                                        VENDER ${displayPrice}
                                    </button>
                                )}
                                {isListed && !isReady && <span className="text-orange-500 text-[9px] font-bold animate-pulse">...</span>}
                                {isReady && (
                                    <button onClick={() => onCollectMoney(fish.uniqueId, customerPresent)} className="w-full bg-green-500 text-white text-[10px] py-0.5 mt-1 border border-black animate-bounce">
                                        PEGAR ${displayPrice}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const UpgradeCard: React.FC<{ icon: React.ReactNode, name: string, cost: number, onClick: () => void, money: number }> = ({ icon, name, cost, onClick, money }) => (
    <div className="min-w-[100px] bg-gray-100 p-2 border-2 border-gray-400 flex flex-col justify-between">
        <p className="font-bold text-black text-[10px] flex items-center gap-1 mb-1">{icon} {name}</p>
        <PixelButton disabled={money < cost} onClick={onClick} color="yellow" className="w-full text-[10px] px-1 py-1">
            {cost}$
        </PixelButton>
    </div>
);