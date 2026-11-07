/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameTab, DeityId, ShrineItem, DemonMonster, FigurineRecord } from './types/game';
import { DEITIES, SHRINE_ITEMS, NPC_DEVOTEES, DEMON_MONSTERS } from './data/gameData';
import { sounds } from './services/soundEffects';
import { HeaderBar } from './components/HeaderBar';
import { MainHall } from './components/MainHall';
import { ShopCounter } from './components/ShopCounter';
import { ExorcismBattle } from './components/ExorcismBattle';
import { CurioCabinet } from './components/CurioCabinet';
import { HandbookModal } from './components/HandbookModal';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<GameTab>('hall');
  const [money, setMoney] = useState<number>(2450); // Initial 2450 Yen as in concept images
  const [reputation, setReputation] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Devotee state
  const [devoteeIndex, setDevoteeIndex] = useState<number>(0);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);

  // Inventory & Packaging Tray
  const [inventory, setInventory] = useState<ShrineItem[]>(SHRINE_ITEMS);
  const [currentTrayItems, setCurrentTrayItems] = useState<ShrineItem[]>([
    // Give initial set so user can start immediately
    SHRINE_ITEMS.find((i) => i.id === 'incense_wire')!,
    SHRINE_ITEMS.find((i) => i.id === 'gold_zhuangyuan')!,
  ]);

  // Exorcism & Collection State
  const [activeDemon, setActiveDemon] = useState<DemonMonster | null>(null);
  const [collection, setCollection] = useState<Record<string, FigurineRecord>>({
    ink_monster: {
      monsterId: 'ink_monster',
      unlocked: true,
      unlockedAt: '一九二六年 拾月',
      level: 1,
      totalOfferingsPlaced: 1,
    },
    headless_ghost: {
      monsterId: 'headless_ghost',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    sea_siren: {
      monsterId: 'sea_siren',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    scissor_lady: {
      monsterId: 'scissor_lady',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    plague_child: {
      monsterId: 'plague_child',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    fire_moth: {
      monsterId: 'fire_moth',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    caged_bird: {
      monsterId: 'caged_bird',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    money_spirit: {
      monsterId: 'money_spirit',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
    puppet_master: {
      monsterId: 'puppet_master',
      unlocked: true,
      level: 1,
      totalOfferingsPlaced: 1,
    },
  });

  // Modal Dialogs
  const [showHandbook, setShowHandbook] = useState<boolean>(false);
  const [successResultModal, setSuccessResultModal] = useState<{
    show: boolean;
    reward: number;
    deityName: string;
    devoteeName: string;
  } | null>(null);

  const [transformationAlert, setTransformationAlert] = useState<{
    show: boolean;
    demon: DemonMonster;
    reason: string;
  } | null>(null);

  const currentDevotee = NPC_DEVOTEES[devoteeIndex % NPC_DEVOTEES.length];

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Clue discovery handler
  const handleDiscoverClue = (clueId: string) => {
    if (!discoveredClues.includes(clueId)) {
      setDiscoveredClues((prev) => [...prev, clueId]);
    }
  };

  // Tray management
  const handleAddToTray = (item: ShrineItem) => {
    if (item.stock <= 0) return;
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock: i.stock - 1 } : i))
    );
    setCurrentTrayItems((prev) => [...prev, item]);
  };

  const handleRemoveFromTray = (index: number) => {
    const item = currentTrayItems[index];
    if (!item) return;
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock: i.stock + 1 } : i))
    );
    setCurrentTrayItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearTray = () => {
    // Return all items back to inventory
    const restored = [...inventory];
    currentTrayItems.forEach((item) => {
      const target = restored.find((i) => i.id === item.id);
      if (target) target.stock += 1;
    });
    setInventory(restored);
    setCurrentTrayItems([]);
  };

  // Restock inventory via wholesale ledger
  const handleRestock = (itemId: string, amount: number, totalCost: number) => {
    // Apply Sea Siren discount if unlocked
    let finalCost = totalCost;
    if (collection.sea_siren?.unlocked) {
      finalCost = Math.round(totalCost * 0.88);
    }

    if (money < finalCost) return;
    setMoney((m) => m - finalCost);
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, stock: i.stock + amount } : i))
    );
  };

  // Advance to next devotee
  const handleAdvanceNextDevotee = () => {
    setDevoteeIndex((prev) => (prev + 1) % NPC_DEVOTEES.length);
    setDiscoveredClues([]);
    setCurrentTrayItems([]);
    setSuccessResultModal(null);
  };

  // Guide devotee to shrine handler
  const handleGuideToShrine = (assignedDeityId: DeityId) => {
    const isCorrectDeity = assignedDeityId === currentDevotee.correctDeity;

    if (isCorrectDeity) {
      // Correct Deity Blessing!
      sounds.playCorrectBlessing();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Calculate reward including buffs
      let reward = currentDevotee.baseReward;
      if (assignedDeityId === 'wenchang' && collection.ink_monster?.unlocked) {
        reward = Math.round(reward * (1 + 0.15 * (collection.ink_monster.level || 1)));
      }
      if (assignedDeityId === 'chenghuang' && collection.headless_ghost?.unlocked) {
        reward = Math.round(reward * (1 + 0.2 * (collection.headless_ghost.level || 1)));
      }

      setMoney((m) => m + reward);
      setReputation((r) => r + 15);

      setSuccessResultModal({
        show: true,
        reward,
        deityName: DEITIES[assignedDeityId].name,
        devoteeName: currentDevotee.name,
      });
    } else {
      // Conflicting deity choice triggers demonization!
      sounds.playWrongCurse();
      const monsterKey = currentDevotee.mistakeMonsterId || 'ink_monster';
      const demon = DEMON_MONSTERS[monsterKey] || DEMON_MONSTERS['ink_monster'];

      setTransformationAlert({
        show: true,
        demon,
        reason: `信眾執念與【${DEITIES[assignedDeityId].name}】神威劇烈衝突，當場妖化！`,
      });
    }
  };

  // Start battle from transformation alert
  const handleStartExorcism = () => {
    if (!transformationAlert) return;
    sounds.playDemonRoar();
    setActiveDemon(transformationAlert.demon);
    setTransformationAlert(null);
    setCurrentTab('battle');
  };

  // Exorcism victory handler
  const handleExorcismVictory = (monsterId: string) => {
    sounds.playFigurineDrop();
    setCollection((prev) => ({
      ...prev,
      [monsterId]: {
        monsterId,
        unlocked: true,
        unlockedAt: '一九二六年 拾月',
        level: prev[monsterId]?.level || 1,
        totalOfferingsPlaced: (prev[monsterId]?.totalOfferingsPlaced || 0) + 1,
      },
    }));

    setMoney((m) => m + 350); // Bountiful exorcism bounty
    setReputation((r) => r + 25);
    setActiveDemon(null);
    setCurrentTab('cabinet');
    handleAdvanceNextDevotee();
  };

  // Upgrade buff in curio cabinet
  const handleUpgradeBuff = (monsterId: string, upgradeCost: number) => {
    if (money < upgradeCost) return;
    setMoney((m) => m - upgradeCost);
    setCollection((prev) => ({
      ...prev,
      [monsterId]: {
        ...prev[monsterId],
        level: (prev[monsterId]?.level || 1) + 1,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1512] text-[#e6dfd5] flex flex-col font-serif">
      {/* Universal Top Bar */}
      <HeaderBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'handbook') {
            setShowHandbook(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        money={money}
        reputation={reputation}
        hasActiveDemon={!!activeDemon}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pb-10">
        {currentTab === 'hall' && (
          <MainHall
            currentDevotee={currentDevotee}
            currentTrayItems={currentTrayItems}
            discoveredClues={discoveredClues}
            onDiscoverClue={handleDiscoverClue}
            onGuideToShrine={handleGuideToShrine}
            onOpenShop={() => setCurrentTab('shop')}
            onOpenTalisman={() => setCurrentTab('battle')}
            onOpenCabinet={() => setCurrentTab('cabinet')}
            onNextDevotee={handleAdvanceNextDevotee}
            hasActiveDemon={!!activeDemon}
          />
        )}

        {currentTab === 'shop' && (
          <ShopCounter
            inventory={inventory}
            trayItems={currentTrayItems}
            money={money}
            onAddToTray={handleAddToTray}
            onRemoveFromTray={handleRemoveFromTray}
            onClearTray={handleClearTray}
            onRestock={handleRestock}
            onBackToHall={() => setCurrentTab('hall')}
          />
        )}

        {currentTab === 'battle' && (
          <ExorcismBattle
            monster={activeDemon || DEMON_MONSTERS['ink_monster']}
            onVictory={handleExorcismVictory}
            onFlee={() => {
              sounds.playWoodFish();
              setActiveDemon(null);
              setCurrentTab('hall');
            }}
          />
        )}

        {currentTab === 'cabinet' && (
          <CurioCabinet
            collection={collection}
            money={money}
            onUpgradeBuff={handleUpgradeBuff}
            onSelectMonsterToBattle={(monster) => {
              setActiveDemon(monster);
              setCurrentTab('battle');
            }}
          />
        )}
      </main>

      {/* Success Blessing Modal */}
      {successResultModal?.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241c16] border-2 border-amber-600 rounded-xl max-w-md w-full p-6 text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs text-amber-500 font-mono tracking-widest uppercase">
                神威大盛 · 心願得遂
              </span>
              <h3 className="text-xl font-bold text-amber-200 mt-1">
                {successResultModal.deityName} 庇佑賜福
              </h3>
            </div>

            <p className="text-xs text-amber-300/80 leading-relaxed">
              信眾【{successResultModal.devoteeName}】因得遇明師廟婆指引，心結盡解，虔敬上香！
            </p>

            <div className="bg-[#1b1410] border border-amber-800 p-3 rounded w-full flex items-center justify-around font-mono text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">奉納香油錢</span>
                <span className="text-amber-300 font-bold text-sm">
                  +{successResultModal.reward} 日圓
                </span>
              </div>
              <div className="w-px h-6 bg-amber-900" />
              <div>
                <span className="text-stone-400 block text-[10px]">案內所聲望</span>
                <span className="text-emerald-400 font-bold text-sm">+15 點</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playWoodFish();
                handleAdvanceNextDevotee();
              }}
              className="w-full py-2.5 rounded font-serif font-bold text-xs bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-500 shadow transition-colors cursor-pointer"
            >
              送迎信眾 · 接待下一位香客
            </button>
          </div>
        </div>
      )}

      {/* Demon Transformation Dramatic Alert Modal */}
      {transformationAlert?.show && (
        <div className="fixed inset-0 bg-red-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#241210] border-2 border-red-600 rounded-xl max-w-lg w-full p-6 text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border-2 border-red-700 relative">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_78baj878baj878ba_9e3241b3.jpg"
                alt="妖化爆發"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover animate-pulse"
              />
              <div className="absolute top-2 left-2 bg-red-950 text-red-200 border border-red-500 text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                大凶 · 執念反噬
              </div>
            </div>

            <div>
              <span className="text-xs text-red-400 font-mono tracking-widest uppercase">
                大凶！拜錯神明！
              </span>
              <h3 className="text-xl font-bold text-red-200 mt-1">
                {transformationAlert.demon.name} 當場現形！
              </h3>
            </div>

            <p className="text-xs text-red-300/80 leading-relaxed">
              {transformationAlert.reason}
              <br />
              信眾執念與神威相衝，煞氣沖霄！若不及時伏魔，案內所將遭怨靈摧毀！
            </p>

            <button
              onClick={handleStartExorcism}
              className="w-full py-3 rounded font-serif font-bold text-xs bg-gradient-to-r from-red-800 via-rose-700 to-red-800 hover:from-red-700 hover:to-rose-600 text-amber-100 border border-red-400 shadow-xl flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <span>立即切換為【降妖伏魔模式】！</span>
            </button>
          </div>
        </div>
      )}

      {/* Handbook Modal */}
      <HandbookModal
        isOpen={showHandbook}
        onClose={() => setShowHandbook(false)}
      />
    </div>
  );
}
