/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sounds } from '../services/soundEffects';
import { Search, Sparkles, BookOpen, X, Maximize2 } from 'lucide-react';

interface KeeperFooterBarProps {
  dialogueText: string;
  speakerName?: string;
  onOpenInspect?: () => void;
  onOpenTalisman?: () => void;
  isInspectActive?: boolean;
  extraButtons?: { label: string; onClick: () => void; active?: boolean }[];
}

export const KeeperFooterBar: React.FC<KeeperFooterBarProps> = ({
  dialogueText,
  speakerName = '廟婆',
  onOpenInspect,
  onOpenTalisman,
  isInspectActive = false,
  extraButtons = [],
}) => {
  const [showFullSheetModal, setShowFullSheetModal] = useState<boolean>(false);

  // User uploaded character sheet image:
  const characterSheetImage = '/assets/aistudio/Gemini_Generated_Image_n25k3zn25k3zn25k_442f5cc5.jpg';

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 mt-auto pt-2 select-none">
        <div className="bg-[#1f1612]/95 border-2 border-amber-900/70 rounded-xl p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-4 backdrop-blur-md relative overflow-hidden">
          {/* Left: Quick Artifact Tool Shortcuts with Vintage Stamp */}
          <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
            {/* Red Seal */}
            <div className="hidden lg:flex flex-col items-center justify-center border-2 border-red-700/80 bg-red-950/40 text-red-500 font-serif font-bold text-[10px] p-1.5 rounded leading-tight">
              <span>奇廟</span>
              <span>幻埕</span>
            </div>

            {/* Tool 1: 靈視放大鏡 */}
            {onOpenInspect && (
              <button
                onClick={() => {
                  sounds.playInspect();
                  onOpenInspect();
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer min-w-[70px] ${
                  isInspectActive
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#2a1d17] border-amber-800/60 text-amber-200 hover:bg-[#38261e]'
                }`}
                title="切換靈視放大鏡"
              >
                <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-300 mb-0.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-serif font-bold whitespace-nowrap">靈視放大鏡</span>
              </button>
            )}

            {/* Tool 2: 畫符 */}
            {onOpenTalisman && (
              <button
                onClick={() => {
                  sounds.playWoodFish();
                  onOpenTalisman();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg border bg-[#2a1d17] border-amber-800/60 text-amber-200 hover:bg-[#38261e] text-center transition-all cursor-pointer min-w-[65px]"
                title="進入降妖伏魔陣"
              >
                <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-300 mb-0.5">
                  <span className="text-xs font-serif font-bold text-amber-400">符</span>
                </div>
                <span className="text-[10px] font-serif font-bold whitespace-nowrap">畫符</span>
              </button>
            )}
          </div>

          {/* Center: Dialogue Box with 廟婆 character portrait */}
          <div className="flex-1 bg-parchment text-[#241a14] border-2 border-[#826649] rounded-lg p-3 shadow-inner flex items-center gap-3.5 relative overflow-hidden self-stretch">
            {/* Character Portrait (廟婆) */}
            <div
              onClick={() => {
                sounds.playWoodFish();
                setShowFullSheetModal(true);
              }}
              className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 border-[#876a4e] overflow-hidden bg-[#241c16] shrink-0 cursor-pointer shadow-md hover:ring-2 hover:ring-amber-600 transition-all"
              title="點擊放大查看廟婆角色四視圖"
            >
              <img
                src="/assets/aistudio/Replace_character_1_2bd99895.jpg"
                alt="主角靈視廟婆"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#1f1612]/90 text-amber-200 text-[10px] font-serif text-center py-0.5 font-bold border-t border-[#876a4e]">
                ({speakerName})
              </div>
              <div className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Dialogue Bubble Text */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-900 font-serif">
                    【案內所 · 靈視心語】
                  </span>
                  <button
                    onClick={() => {
                      sounds.playWoodFish();
                      setShowFullSheetModal(true);
                    }}
                    className="text-[10px] text-amber-800 underline hover:text-amber-950 flex items-center gap-0.5 cursor-pointer"
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>查看廟婆四視設定圖</span>
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-serif text-[#2f221a] leading-relaxed line-clamp-2 md:line-clamp-3">
                {dialogueText}
              </p>
            </div>
          </div>

          {/* Right: Contextual Quick-Action Buttons */}
          {extraButtons.length > 0 && (
            <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-stretch md:self-auto justify-end">
              {extraButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sounds.playWoodFish();
                    btn.onClick();
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center justify-center ${
                    btn.active
                      ? 'bg-amber-700 text-amber-100 border-amber-400 shadow'
                      : 'bg-[#2b1f18] hover:bg-[#3a2a20] text-amber-200 border-amber-800/60'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Resolution Character Sheet Modal */}
      {showFullSheetModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#241c16] border-2 border-amber-800/90 rounded-xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl font-serif">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-amber-900/60 bg-[#1c1410] text-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  主角：靈視廟婆（年輕女性）角色四視圖與配件折解
                </h3>
              </div>
              <button
                onClick={() => {
                  sounds.playWoodFish();
                  setShowFullSheetModal(false);
                }}
                className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center bg-[#17110d]">
              <div className="relative w-full rounded border-2 border-amber-900/70 overflow-hidden shadow-2xl bg-black">
                <img
                  src={characterSheetImage}
                  alt="主角：靈視廟婆角色四視圖"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                />
              </div>

              {/* Character Attributes & Outfit Details */}
              <div className="w-full mt-4 bg-[#231a15] border border-amber-900/50 rounded-lg p-3.5 text-xs text-amber-200/90 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 className="font-bold text-amber-400 mb-1">【服飾造型】大正浪漫和洋折衷風格</h4>
                  <p className="text-amber-300/80">
                    一刀剪短髮，綁著半高髮髻，配戴紅繩朱印髮飾。身穿墨綠雲紋羽織與赤紅行燈袴，腳踩洋式高筒繫帶短皮靴。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 mb-1">【隨身法寶與配件折解】</h4>
                  <p className="text-amber-300/80">
                    配備「靈視放大鏡」探查執念幽冥之相、「降魔桃木劍」斬擊煞氣、「天罡硃砂符紙」與「案內所八卦提燈／修竹提燈」。
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-3 bg-[#1c1410] border-t border-amber-900/60 flex justify-end">
              <button
                onClick={() => {
                  sounds.playWoodFish();
                  setShowFullSheetModal(false);
                }}
                className="px-4 py-1.5 rounded text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600 transition-colors cursor-pointer"
              >
                關閉檢視
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
