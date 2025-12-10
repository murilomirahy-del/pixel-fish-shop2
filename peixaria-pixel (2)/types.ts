
export type ViewType = 'FISHING' | 'SHOP' | 'AQUARIUM' | 'MAP';

export enum FishRarity {
  COMMON = 'Comum',
  RARE = 'Raro',
  LEGENDARY = 'Lendário',
  MYTHIC = 'MÍTICO',
}

export type FishingSpotId = 'COAST' | 'RIVER' | 'OCEAN';

export interface FishType {
  id: string;
  name: string;
  price: number;
  rarity: FishRarity;
  icon: string; // Emoji representation
  difficulty: number; // 0-100, lower is harder to catch (smaller window)
  location: FishingSpotId[]; // Where can this fish be found?
}

export type SellStatus = 'CAUGHT' | 'LISTED' | 'READY';

export interface CaughtFish extends FishType {
  uniqueId: string;
  sellStatus: SellStatus;
  sellReadyTime?: number; // Timestamp when it will be ready
  qualityMultiplier: number; // Based on catch streak
}

export type WeatherType = 'SUNNY' | 'RAINY' | 'STORMY';
export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface Mission {
  id: number;
  description: string;
  type: 'CATCH' | 'EARN'; // Catch specific fish count OR earn money amount
  targetId?: string; // If catch, which fish? If null, any fish.
  targetAmount: number;
  currentAmount: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export interface MarketTrend {
    hotFishId: string | null;
    coldFishId: string | null;
}

export interface PlayerState {
  money: number;
  inventory: CaughtFish[];
  aquarium: string[]; // List of Fish IDs collected
  rodLevel: number; // Catch difficulty
  boatLevel: number; // Inventory Size (Big steps)
  stockLevel: number; // Inventory Size (Small steps)
  marketingLevel: number; // Sell Speed & Spawn Rate
  baitLevel: number; // Rarity Chance
  iceLevel: number; // Price Bonus
  luckLevel: number; // Mythic Chance
  day: number;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  missions: Mission[];
  marketTrend: MarketTrend;
  catchStreak: number;
}
