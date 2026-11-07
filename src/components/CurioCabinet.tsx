/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DemonMonster, FigurineRecord } from '../types/game';
import { DEMON_MONSTERS } from '../data/gameData';
import { sounds } from '../services/soundEffects';
import { RotateCw, Sparkles, BookOpen, ArrowUpCircle, CheckCircle, Lock } from 'lucide-react';
import { KeeperFooterBar } from './KeeperFooterBar';

interface CurioCabinetProps {
  collection: Record<string, FigurineRecord>;
  money: number;
  onUpgradeBuff: (monsterId: string, upgradeCost: number) => void;
  onSelectMonsterToBattle: (monster: DemonMonster) => void;
}

export const CurioCabinet: React.FC<CurioCabinetProps> = ({
  collection,
  money,
  onUpgradeBuff,
  onSelectMonsterToBattle,
}) => {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('ink_monster');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const selectedMonster = DEMON_MONSTERS[selectedMonsterId] || DEMON_MONSTERS['ink_monster'];
  const record = collection[selectedMonsterId] || {
    monsterId: selectedMonsterId,
    unlocked: false,
    level: 1,
    totalOfferingsPlaced: 0,
  };

  const unlockedCount = Object.values(collection).filter((c) => c.unlocked).length;
  const totalDisplaySlots = 12; // 12 grid positions

  const monsterList = Object.values(DEMON_MONSTERS);

  const handleRotate = () => {
    sounds.playWoodFish();
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleUpgrade = () => {
    const cost = record.level * 100;
    if (money >= cost) {
      sounds.playCorrectBlessing();
      onUpgradeBuff(selectedMonsterId, cost);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Top Shelf Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#231a15] border border-amber-900/50 rounded-lg p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-amber-100 font-bold font-serif text-lg">
              百鬼多寶格 · 妖怪公仔陳列櫃
            </h2>
            <span className="text-xs text-amber-500 border border-amber-800/60 px-2 py-0.5 rounded font-mono">
              目前收集：{unlockedCount} / 24 隻
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1">
            被紫金葫蘆封印的信眾執念，安放於多寶格中可轉化為庇佑廟宇的【靈障加護 Buff】。
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {(['all', 'unlocked', 'locked'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sounds.playWoodFish();
                setActiveTab(t);
              }}
              className={`px-3 py-1.5 rounded text-xs font-serif transition-colors cursor-pointer ${
                activeTab === t
                  ? 'bg-amber-800/70 text-amber-100 border border-amber-600 font-bold'
                  : 'bg-[#1a1410] text-amber-400/80 hover:bg-amber-950/40 border border-amber-950'
              }`}
            >
              {t === 'all' && '全部珍品'}
              {t === 'unlocked' && `已封印 (${unlockedCount})`}
              {t === 'locked' && `未得 (${24 - unlockedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Curio Shelves (6-8 cols) | Right Detail Handbook Scroll (4-6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-shelf Showcase Display */}
        <div className="lg:col-span-7 bg-[#201712] border-2 border-amber-950/90 rounded-lg p-5 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
            <span className="text-xs font-serif text-amber-300 font-bold">
              紫檀木百寶雕花架
            </span>
            <span className="text-[10px] text-amber-600 font-mono">
              靈視公仔展位（點選檢視）
            </span>
          </div>

          {/* Shelves Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {monsterList.map((m) => {
              const itemRecord = collection[m.id];
              const isUnlocked = itemRecord?.unlocked ?? false;
              const isSelected = selectedMonsterId === m.id;

              if (activeTab === 'unlocked' && !isUnlocked) return null;
              if (activeTab === 'locked' && isUnlocked) return null;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    sounds.playWoodFish();
                    setSelectedMonsterId(m.id);
                  }}
                  className={`relative p-3 rounded-lg border-2 flex flex-col items-center justify-between gap-2 transition-all cursor-pointer shadow-lg ${
                    isSelected
                      ? 'border-amber-400 bg-[#34241b] ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : isUnlocked
                      ? 'border-amber-900/60 bg-[#271d17] hover:border-amber-700/80 hover:bg-[#2f221a]'
                      : 'border-stone-900 bg-[#16100d] opacity-50'
                  }`}
                >
                  {/* Miniature Display Figurine */}
                  <div className="relative w-20 h-20 rounded bg-stone-950/80 border border-amber-900/40 overflow-hidden flex items-center justify-center p-1">
                    {isUnlocked ? (
                      <img
                        src={m.spriteUrl}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Lock className="w-6 h-6 text-stone-600" />
                    )}

                    {isUnlocked && (
                      <span className="absolute top-1 right-1 bg-amber-950/90 text-amber-300 text-[9px] px-1 rounded font-mono border border-amber-800">
                        Lv.{itemRecord?.level || 1}
                      </span>
                    )}
                  </div>

                  {/* Figurine Label Plaque */}
                  <div className="text-center w-full">
                    <span className="font-serif font-bold text-xs text-amber-200 block truncate">
                      {isUnlocked ? m.name : '？？？（未收服）'}
                    </span>
                    <span className="text-[10px] text-amber-500 font-mono block truncate">
                      {isUnlocked ? `【${m.buffName}】` : '拜錯神明觸發'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty slots for visual curio feeling */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="p-3 rounded-lg border border-dashed border-amber-950/60 bg-[#17110d] flex flex-col items-center justify-center text-center min-h-[140px] opacity-35"
              >
                <span className="text-xs text-stone-600 font-serif">第 {i + 10} 格</span>
                <span className="text-[10px] text-stone-700">虛位以待</span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-3 border-t border-amber-900/30 flex justify-between items-center text-[11px] text-amber-500">
            <span>*提示：若在案內所信眾拜錯神位，即可降妖收服新公仔！</span>
            <button
              onClick={() => {
                sounds.playDemonRoar();
                onSelectMonsterToBattle(selectedMonster);
              }}
              className="text-amber-400 underline hover:text-amber-200 cursor-pointer"
            >
              【挑戰該妖物進行伏魔】
            </button>
          </div>
        </div>

        {/* Right Column: Figurine Handbook Scroll / Detail Dossier */}
        <div className="lg:col-span-5 bg-parchment text-[#241a15] border-2 border-[#826649] rounded-lg p-5 shadow-2xl flex flex-col justify-between font-serif relative overflow-hidden">
          {/* Antique Red Stamp */}
          <div className="absolute top-3 right-3 border-2 border-red-800 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold rotate-12">
            奇廟幻埕案內所 · 封印
          </div>

          <div className="flex flex-col gap-4">
            {/* Header Title & Japanese Subtitle */}
            <div className="border-b-2 border-[#a68c70] pb-2">
              <span className="text-[10px] text-red-900 font-bold uppercase tracking-widest">
                {selectedMonster.id === 'headless_ghost'
                  ? '百鬼多寶格 · 卷之二'
                  : selectedMonster.id === 'sea_siren'
                  ? '百鬼多寶格 · 卷之三'
                  : selectedMonster.id === 'scissor_lady'
                  ? '百鬼多寶格 · 卷之四'
                  : selectedMonster.id === 'plague_child'
                  ? '百鬼多寶格 · 卷之五'
                  : selectedMonster.id === 'fire_moth'
                  ? '百鬼多寶格 · 卷之六'
                  : selectedMonster.id === 'caged_bird'
                  ? '百鬼多寶格 · 卷之七'
                  : selectedMonster.id === 'money_spirit'
                  ? '百鬼多寶格 · 卷之八'
                  : selectedMonster.id === 'puppet_master'
                  ? '百鬼多寶格 · 卷之九'
                  : '百鬼多寶格 · 卷之一'}
              </span>
              <h3 className="text-xl font-bold text-[#1f1510] mt-0.5">
                {selectedMonster.name}
              </h3>
              <span className="text-xs text-[#6e5842] font-mono">
                {selectedMonster.japaneseName} · {selectedMonster.sealYear}
              </span>
            </div>

            {/* Figurine Visual Showcase */}
            <div className="relative w-full aspect-[4/3] rounded border-2 border-[#94785b] overflow-hidden bg-[#e8dcce] shadow-inner flex items-center justify-center">
              <img
                src={selectedMonster.spriteUrl}
                alt={selectedMonster.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Material Survey */}
            <div>
              <h4 className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                <span>◆ 材質調查與工藝</span>
              </h4>
              <p className="text-xs leading-relaxed text-[#403024]">
                {selectedMonster.material}
              </p>
            </div>

            {/* Lore & Historical Origin */}
            <div>
              <h4 className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                <span>◆ 緣起背景 · 大正奇譚</span>
              </h4>
              <p className="text-xs leading-relaxed text-[#403024]">
                {selectedMonster.lore}
              </p>
            </div>

            {/* Passive Buff Section & Upgrade Button */}
            <div className="bg-[#ebd9c5] border border-[#a88f74] p-3 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-red-900">
                  靈障加護：【{selectedMonster.buffName}】
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2a1d15]">
                  等級: Lv.{record.level}
                </span>
              </div>
              <p className="text-xs text-[#3b2b1f] leading-relaxed">
                {selectedMonster.buffDescription}
              </p>

              <div className="pt-2 border-t border-[#c2aa91] flex items-center justify-between mt-1">
                <span className="text-[11px] font-mono text-[#523d2e]">
                  升級所需香油錢：{record.level * 100} 日圓
                </span>
                <button
                  onClick={handleUpgrade}
                  disabled={money < record.level * 100 || !record.unlocked}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    record.unlocked && money >= record.level * 100
                      ? 'bg-red-900 hover:bg-red-800 text-amber-100 shadow border border-red-700'
                      : 'bg-stone-400 text-stone-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  <span>升級加護</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Keeper Dialogue Bar with Uploaded Character Art */}
      <KeeperFooterBar
        dialogueText="這些被封印的執念，都好好地安置在多寶格裡了。點擊公仔可以查看他們的因果，還能為廟宇帶來庇佑喔！"
        speakerName="廟婆"
        extraButtons={[
          {
            label: '旋轉公仔',
            onClick: handleRotate,
          },
          {
            label: '升級加護',
            onClick: handleUpgrade,
            active: record.unlocked && money >= record.level * 100,
          },
        ]}
      />
    </div>
  );
};
