/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameTab } from '../types/game';
import { Volume2, VolumeX, Sparkles, AlertTriangle } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface HeaderBarProps {
  currentTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  money: number;
  reputation: number;
  hasActiveDemon: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  onSelectTab,
  money,
  reputation,
  hasActiveDemon,
  soundEnabled,
  onToggleSound,
}) => {
  const navTabs: { id: GameTab; label: string; badge?: string }[] = [
    { id: 'title', label: '主畫面' },
    { id: 'hall', label: '案內本堂' },
    { id: 'shop', label: '供品販賣部' },
    { id: 'battle', label: '降妖法陣', badge: hasActiveDemon ? '妖氣沖天' : undefined },
    { id: 'cabinet', label: '百鬼多寶格' },
    { id: 'handbook', label: '廟務手冊' },
  ];

  return (
    <header className="flex items-center justify-between gap-8 px-5 py-3 border-b border-amber-900/40 bg-[#1e1713]/95 text-[#f4ecd8] shadow-md z-40 select-none">
      {/* Zone 1: Single text element wordmark with vintage seal */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sounds.playWoodFish();
            onSelectTab('title');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full border border-amber-500/50 bg-amber-950/60 flex items-center justify-center text-amber-300 font-serif text-sm shadow-inner group-hover:scale-105 transition-transform">
            廟
          </div>
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-lg font-bold tracking-wider text-amber-200 font-serif whitespace-nowrap">
              奇廟幻埕案內所
            </span>
            <span className="text-xs font-serif font-bold text-amber-300 border border-amber-600/60 bg-amber-950/70 px-1.5 py-0.5 rounded tracking-wide shadow-sm">
              廟婆營業中
            </span>
            <span className="text-xs text-amber-600 border border-amber-800/60 bg-amber-950/40 px-1.5 py-0.5 rounded tracking-widest font-mono hidden sm:inline">
              大正拾五年
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-2 md:gap-5 text-sm font-medium">
        {navTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playWoodFish();
                onSelectTab(tab.id);
              }}
              className={`relative px-3 py-1.5 rounded transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'text-amber-100 bg-amber-900/50 border border-amber-700/60 shadow-inner'
                  : 'text-amber-300/70 hover:text-amber-200 hover:bg-amber-950/40'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="animate-pulse bg-red-800 text-red-100 text-[10px] px-1.5 py-0.2 rounded border border-red-500">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 Primary Action Area / Stats Display */}
      <div className="flex items-center gap-4 shrink-0 text-xs">
        {/* 香油錢日圓口袋 */}
        <div className="flex items-center gap-2 bg-[#2a1d15] border border-amber-800/50 px-3 py-1.5 rounded shadow-inner">
          <span className="text-amber-400 font-serif">香油錢</span>
          <span className="text-amber-200 font-mono text-sm font-bold tabular-nums">
            {money.toLocaleString()}
          </span>
          <span className="text-amber-500 text-[11px]">日圓</span>
        </div>

        {/* 廟宇聲望 */}
        <div className="hidden sm:flex items-center gap-1.5 text-amber-300/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>香火度</span>
          <span className="font-mono text-amber-300 font-bold tabular-nums">{reputation}</span>
        </div>

        {/* 音效開關 */}
        <button
          onClick={() => {
            onToggleSound();
            sounds.playWoodFish();
          }}
          title={soundEnabled ? '靜音' : '開啟音效'}
          className="p-1.5 rounded border border-amber-900/60 bg-[#251a14] hover:bg-amber-900/30 text-amber-300 transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
        </button>
      </div>
    </header>
  );
};
