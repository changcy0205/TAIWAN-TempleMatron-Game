/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DeityId = 'chenghuang' | 'wenchang' | 'mazu' | 'yuelao' | 'baosheng';

export interface DeityInfo {
  id: DeityId;
  name: string;
  title: string;
  domain: string;
  description: string;
  recommendedOfferings: string[];
  misfitDemon: string;
  color: string;
}

export type ItemCategory = 'incense' | 'joss_paper' | 'talisman_special' | 'food_tribute';

export interface ShrineItem {
  id: string;
  name: string;
  category: ItemCategory;
  cost: number;       // 進貨價
  price: number;      // 販售價
  stock: number;      // 當前庫存
  unit: string;
  icon: string;
  description: string;
  symbolism: string;  // 寓意
  suitableDeities: DeityId[];
}

export interface ClueInfo {
  id: string;
  label: string;
  part: string;
  description: string;
  discovered: boolean;
  xPct: number; // percentage coordinates on NPC illustration for inspection
  yPct: number;
}

export interface DialogueOption {
  text: string;
  response: string;
  keeperReply: string;
  revealsClueId?: string;
  suggestsDeity?: DeityId;
}

export interface NpcDevotee {
  id: string;
  name: string;
  identity: string;
  appearance: string;
  avatarUrl: string;
  fullBodyUrl?: string;
  coverClueImage?: string;
  surfaceGoal: string;
  hiddenTruth: string;
  dialogueHistory: string[];
  options: DialogueOption[];
  clues: ClueInfo[];
  correctDeity: DeityId;
  correctItemIds: string[];
  mistakeMonsterId: string;
  baseReward: number;
}

export interface DemonMonster {
  id: string;
  name: string;
  japaneseName: string;
  deityMisfit: DeityId;
  hp: number;
  maxHp: number;
  shieldHp: number;
  maxShieldHp: number;
  attackPower: number;
  title: string;
  material: string;
  lore: string;
  sealYear: string;
  buffName: string;
  buffDescription: string;
  buffType:
    | 'income_wenchang'
    | 'income_chenghuang'
    | 'discount_shop'
    | 'yuelao_boost'
    | 'patient_boost'
    | 'fire_ward'
    | 'freedom_blessing'
    | 'wealth_fortune'
    | 'theatre_blessing'
    | string;
  buffValue: number;
  spriteUrl: string;
  detailBookUrl: string;
}

export interface FigurineRecord {
  monsterId: string;
  unlocked: boolean;
  unlockedAt?: string;
  level: number;
  totalOfferingsPlaced: number;
}

export type GameTab = 'hall' | 'shop' | 'battle' | 'cabinet' | 'handbook';

export type BattlePhase = 'shield_talisman' | 'weapon_qte' | 'gourd_seal' | 'victory';
