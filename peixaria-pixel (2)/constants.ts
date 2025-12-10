
import { FishRarity, FishType } from './types';

// Assigning locations to fish
export const FISH_TYPES: FishType[] = [
  // --- COAST (Easy/Mixed) ---
  { id: 'sardine', name: 'Sardinha', price: 10, rarity: FishRarity.COMMON, icon: '🐟', difficulty: 90, location: ['COAST'] },
  { id: 'clownfish', name: 'Peixe-Palhaço', price: 15, rarity: FishRarity.COMMON, icon: '🐠', difficulty: 85, location: ['COAST'] },
  { id: 'mackerel', name: 'Cavala', price: 25, rarity: FishRarity.COMMON, icon: '🐟', difficulty: 80, location: ['COAST'] },
  { id: 'sea_bass', name: 'Robalo', price: 45, rarity: FishRarity.RARE, icon: '🐟', difficulty: 60, location: ['COAST'] },
  { id: 'squid', name: 'Lula', price: 40, rarity: FishRarity.RARE, icon: '🦑', difficulty: 55, location: ['COAST'] },
  { id: 'puffer', name: 'Baiacu', price: 50, rarity: FishRarity.RARE, icon: '🐡', difficulty: 45, location: ['COAST'] },
  { id: 'crab', name: 'Caranguejo Rei', price: 120, rarity: FishRarity.RARE, icon: '🦀', difficulty: 40, location: ['COAST'] },
  
  // --- RIVER (Medium - Green/Nature) ---
  { id: 'tilapia', name: 'Tilápia', price: 18, rarity: FishRarity.COMMON, icon: '🐟', difficulty: 85, location: ['RIVER'] },
  { id: 'catfish', name: 'Bagre', price: 20, rarity: FishRarity.COMMON, icon: '🐟', difficulty: 80, location: ['RIVER'] },
  { id: 'trout', name: 'Truta', price: 30, rarity: FishRarity.COMMON, icon: '🐟', difficulty: 70, location: ['RIVER'] },
  { id: 'peacock_bass', name: 'Tucunaré', price: 55, rarity: FishRarity.RARE, icon: '🐟', difficulty: 50, location: ['RIVER'] },
  { id: 'piranha', name: 'Piranha', price: 60, rarity: FishRarity.RARE, icon: '🦷', difficulty: 40, location: ['RIVER'] },
  { id: 'salmon', name: 'Salmão', price: 70, rarity: FishRarity.RARE, icon: '🐡', difficulty: 35, location: ['RIVER'] },
  { id: 'electric_eel', name: 'Enguia Elétrica', price: 300, rarity: FishRarity.RARE, icon: '⚡', difficulty: 25, location: ['RIVER'] }, // Rain Only logic in BoatScene
  { id: 'golden_carp', name: 'Carpa Dourada', price: 500, rarity: FishRarity.LEGENDARY, icon: '👑', difficulty: 12, location: ['RIVER'] },

  // --- OCEAN (Hard - Deep Water) ---
  { id: 'shrimp', name: 'Camarão', price: 25, rarity: FishRarity.COMMON, icon: '🦐', difficulty: 80, location: ['OCEAN'] },
  { id: 'stingray', name: 'Arraia', price: 90, rarity: FishRarity.RARE, icon: '🛸', difficulty: 35, location: ['OCEAN'] },
  { id: 'swordfish', name: 'Espadarte', price: 100, rarity: FishRarity.RARE, icon: '🦈', difficulty: 30, location: ['OCEAN'] },
  { id: 'tuna', name: 'Atum Gigante', price: 150, rarity: FishRarity.RARE, icon: '🦈', difficulty: 25, location: ['OCEAN', 'COAST'] },
  { id: 'hammerhead', name: 'Tubarão Martelo', price: 350, rarity: FishRarity.LEGENDARY, icon: '🦈', difficulty: 15, location: ['OCEAN'] },
  { id: 'marlin', name: 'Marlin Azul', price: 400, rarity: FishRarity.LEGENDARY, icon: '🗡️', difficulty: 10, location: ['OCEAN'] },
  { id: 'anglerfish', name: 'Peixe-Diabo', price: 600, rarity: FishRarity.LEGENDARY, icon: '💡', difficulty: 8, location: ['OCEAN'] }, // Night/Deep
  { id: 'kraken_baby', name: 'Bebê Kraken', price: 1000, rarity: FishRarity.LEGENDARY, icon: '🐙', difficulty: 5, location: ['OCEAN'] },
  { id: 'thunder_shark', name: 'Tubarão Trovão', price: 2000, rarity: FishRarity.LEGENDARY, icon: '🦈⚡', difficulty: 4, location: ['OCEAN'] }, // Storm Only

  // --- MYTHIC (Anywhere, very rare) ---
  { id: 'golden_turtle', name: 'TARTARUGA ANCESTRAL', price: 5000, rarity: FishRarity.MYTHIC, icon: '🐢', difficulty: 3, location: ['COAST', 'OCEAN'] },
  { id: 'cosmic_leviathan', name: 'LEVIATÃ CÓSMICO', price: 10000, rarity: FishRarity.MYTHIC, icon: '🌌', difficulty: 1, location: ['COAST', 'RIVER', 'OCEAN'] },
];

// Base Costs
export const ROD_UPGRADE_COST = 500;
export const STOCK_UPGRADE_COST = 300;
export const BOAT_UPGRADE_COST = 1000;
export const MARKETING_UPGRADE_COST = 400;
export const BAIT_UPGRADE_COST = 600;
export const ICE_UPGRADE_COST = 800;
export const LUCK_UPGRADE_COST = 2500;

export const CUSTOMER_BONUS_MULTIPLIER = 1.5;
export const MAX_INVENTORY_BASE = 5;

// Sell Times (in ms)
export const MIN_SELL_TIME = 20000;
export const MAX_SELL_TIME = 40000;

// Market Trend Times (in ms) - 5 to 8 minutes
export const MIN_MARKET_TIME = 300000;
export const MAX_MARKET_TIME = 480000;

// Time Cycle
export const PHASE_DURATION = 120000; // 2 minutes per phase (Day, Afternoon, Night)
