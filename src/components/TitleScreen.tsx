/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sounds } from '../services/soundEffects';
import {
  Sparkles,
  BookOpen,
  PackageOpen,
  DoorOpen,
  Search,
  Flame,
  Clock,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenCabinet: () => void;
  onOpenShop: () => void;
  onOpenHandbook: () => void;
  onOpenTalisman: () => void;
  money: number;
  reputation: number;
  totalCollected: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenCabinet,
  onOpenShop,
  onOpenHandbook,
  onOpenTalisman,
  money,
  reputation,
  totalCollected,
  soundEnabled,
  onToggleSound,
  onResetGame,
}) => {
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showClockModal, setShowClockModal] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const triggerTip = (msg: string) => {
    setActiveTooltip(msg);
    setTimeout(() => {
      setActiveTooltip(null);
    }, 2800);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-3 sm:p-5 flex flex-col items-center select-none font-serif">
      {/* Visual Canvas Container with Vintage Taisho Frame */}
      <div className="relative w-full rounded-2xl border-4 border-[#7d5e41] shadow-[0_12px_45px_rgba(0,0,0,0.85)] bg-[#17110d] overflow-hidden">
        {/* Main 16:9 Aspect Ratio Container */}
        <div className="relative w-full aspect-[16/9] overflow-hidden group">
          {/* Cover Artwork */}
          <img
            src="/assets/aistudio/Gemini_Generated_Image_uextmhuextmhuext_cf75cfd3.jpg"
            alt="奇廟幻埕案內所：廟婆營業中 主畫面"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Interactive Button Overlays positioned to match artwork elements exactly */}

          {/* 1. Center Main Button: 【開始營業】 進入遊戲 */}
          <button
            onClick={() => {
              sounds.playBell();
              onStartGame();
            }}
            style={{
              left: '40.6%',
              top: '59.2%',
              width: '18.8%',
              height: '14.2%',
            }}
            className="absolute rounded-lg border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/start flex items-center justify-center shadow-none hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]"
            title="【開始營業】進入遊戲大殿迎客"
          >
            <span className="sr-only">開始營業 進入遊戲</span>
            <div className="opacity-0 group-hover/start:opacity-100 transition-opacity absolute -top-8 px-2.5 py-1 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>點擊啟動大殿營業 · 辨識信眾執念</span>
            </div>
          </button>

          {/* 2. Bottom Row - Left: 【百鬼多寶格】 妖怪圖鑑 */}
          <button
            onClick={() => {
              sounds.playWoodFish();
              onOpenCabinet();
            }}
            style={{
              left: '25.2%',
              top: '78.5%',
              width: '15.3%',
              height: '13.2%',
            }}
            className="absolute rounded-lg border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/cabinet flex items-center justify-center hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            title="【百鬼多寶格】檢視妖怪公仔與古籍卷軸"
          >
            <span className="sr-only">百鬼多寶格 妖怪圖鑑</span>
            <div className="opacity-0 group-hover/cabinet:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              開啟百鬼多寶格陳列（已收服 {totalCollected} 尊）
            </div>
          </button>

          {/* 3. Bottom Row - Center: 【進貨帳本】 設定/商店 */}
          <button
            onClick={() => {
              sounds.playCashRegister();
              onOpenShop();
            }}
            style={{
              left: '42.6%',
              top: '78.5%',
              width: '14.6%',
              height: '13.2%',
            }}
            className="absolute rounded-lg border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/shop flex items-center justify-center hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            title="【進貨帳本】管理線香、金紙與供品庫存"
          >
            <span className="sr-only">進貨帳本 設定/商店</span>
            <div className="opacity-0 group-hover/shop:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              翻閱進貨帳本 · 採購祭拜物料
            </div>
          </button>

          {/* 4. Bottom Row - Right: 【案內所紀事】 繼續遊戲/存檔 */}
          <button
            onClick={() => {
              sounds.playWoodFish();
              onOpenHandbook();
            }}
            style={{
              left: '60%',
              top: '78.5%',
              width: '16.2%',
              height: '13.2%',
            }}
            className="absolute rounded-lg border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/handbook flex items-center justify-center hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            title="【案內所紀事】廟務營運手冊與鄉野奇譚"
          >
            <span className="sr-only">案內所紀事 繼續遊戲/存檔</span>
            <div className="opacity-0 group-hover/handbook:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              查閱神龕對應與鄉野奇譚
            </div>
          </button>

          {/* 5. Bottom Row - Far Right: 【退隱江湖】 離開遊戲 */}
          <button
            onClick={() => {
              sounds.playWoodFish();
              setShowExitModal(true);
            }}
            style={{
              left: '84.3%',
              top: '82.5%',
              width: '12.4%',
              height: '11%',
            }}
            className="absolute rounded-lg border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/exit flex items-center justify-center hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            title="【退隱江湖】離開或重置廟宇營運"
          >
            <span className="sr-only">退隱江湖 離開遊戲</span>
            <div className="opacity-0 group-hover/exit:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              閉閣小憩 · 製作組名錄
            </div>
          </button>

          {/* 6. Bottom Left Tool Hotspot: 靈視放大鏡 */}
          <button
            onClick={() => {
              sounds.playInspect();
              triggerTip('【靈視放大鏡】已注滿靈力！進入大殿即可照見信眾暗藏之執念！');
            }}
            style={{
              left: '4.2%',
              top: '76.5%',
              width: '7.8%',
              height: '17.8%',
            }}
            className="absolute rounded-xl border-2 border-emerald-400/0 hover:border-emerald-300/80 bg-emerald-400/0 hover:bg-emerald-500/15 transition-all duration-300 cursor-pointer z-20 group/magnifier flex items-center justify-center hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            title="靈視放大鏡：探查信眾隨身物品"
          >
            <span className="sr-only">靈視放大鏡</span>
            <div className="opacity-0 group-hover/magnifier:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-emerald-200 text-xs rounded border border-emerald-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              法器：靈視放大鏡
            </div>
          </button>

          {/* 7. Bottom Left Tool Hotspot: 畫符 */}
          <button
            onClick={() => {
              sounds.playBell();
              onOpenTalisman();
            }}
            style={{
              left: '12.6%',
              top: '76.5%',
              width: '6.4%',
              height: '17.8%',
            }}
            className="absolute rounded-xl border-2 border-red-400/0 hover:border-red-400/80 bg-red-400/0 hover:bg-red-500/15 transition-all duration-300 cursor-pointer z-20 group/talisman flex items-center justify-center hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            title="畫符：進入降妖伏魔陣"
          >
            <span className="sr-only">畫符法陣</span>
            <div className="opacity-0 group-hover/talisman:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-black/90 text-red-200 text-xs rounded border border-red-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              進入降妖伏魔陣法
            </div>
          </button>

          {/* 8. Top Left Antique Clock & Calendar Plaque */}
          <button
            onClick={() => {
              sounds.playBell();
              setShowClockModal(true);
            }}
            style={{
              left: '2.5%',
              top: '6.5%',
              width: '16.5%',
              height: '46%',
            }}
            className="absolute rounded-2xl border-2 border-amber-400/0 hover:border-amber-300/80 bg-amber-400/0 hover:bg-amber-500/15 transition-all duration-300 cursor-pointer z-20 group/clock hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]"
            title="時辰鐘與大稻埕時憲曆"
          >
            <span className="sr-only">時辰曆法</span>
            <div className="opacity-0 group-hover/clock:opacity-100 transition-opacity absolute top-4 left-4 px-2 py-1 bg-black/90 text-amber-200 text-xs rounded border border-amber-500/80 shadow-lg whitespace-nowrap pointer-events-none">
              大正拾五年 · 六月六日
            </div>
          </button>

          {/* Temporary Floating Toast Alert */}
          {activeTooltip && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-lg bg-black/90 border border-emerald-400 text-emerald-200 text-xs shadow-2xl animate-bounce flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{activeTooltip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Auxiliary Control Bar (Mobile-friendly direct buttons & quick status) */}
      <div className="w-full mt-4 bg-[#231a14]/95 border-2 border-amber-900/60 rounded-xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#18110c] border border-amber-800/60 rounded font-mono text-amber-300">
            <span>香油錢:</span>
            <span className="text-amber-400 font-bold">{money}</span>
            <span className="text-[10px] text-amber-500">日圓</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#18110c] border border-amber-800/60 rounded font-mono text-emerald-300">
            <span>聲望:</span>
            <span className="text-emerald-400 font-bold">{reputation}%</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#18110c] border border-amber-800/60 rounded font-mono text-purple-300">
            <span>已收服公仔:</span>
            <span className="text-purple-400 font-bold">{totalCollected} / 9</span>
          </div>
        </div>

        {/* Buttons List for easy mobile touch */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              sounds.playBell();
              onStartGame();
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-stone-950 font-bold shadow flex items-center gap-1.5 cursor-pointer border border-amber-400"
          >
            <DoorOpen className="w-4 h-4" />
            <span>開始營業（進入大殿）</span>
          </button>

          <button
            onClick={() => {
              sounds.playWoodFish();
              onOpenCabinet();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#2e2017] hover:bg-[#3d2b20] text-amber-200 border border-amber-800/70 shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>百鬼多寶格</span>
          </button>

          <button
            onClick={() => {
              sounds.playCashRegister();
              onOpenShop();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#2e2017] hover:bg-[#3d2b20] text-amber-200 border border-amber-800/70 shadow flex items-center gap-1.5 cursor-pointer"
          >
            <PackageOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>進貨帳本</span>
          </button>

          <button
            onClick={() => {
              sounds.playWoodFish();
              onOpenHandbook();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#2e2017] hover:bg-[#3d2b20] text-amber-200 border border-amber-800/70 shadow flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>案內所紀事</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-[#2e2017] hover:bg-[#3d2b20] text-amber-300 border border-amber-800/70 shadow cursor-pointer"
            title={soundEnabled ? '關閉音效' : '開啟音效'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="mt-3 text-stone-500 text-[11px] font-mono tracking-wider">
        版權所有 © 奇廟幻埕案內所製作組 / 一九二六年 · 大稻埕和洋折衷奇譚
      </div>

      {/* Clock & Calendar Modal */}
      {showClockModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241a15] border-2 border-amber-700 rounded-xl max-w-md w-full p-6 text-amber-100 shadow-2xl relative font-serif">
            <button
              onClick={() => setShowClockModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-amber-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-amber-200">
                時憲懷錶 · 大稻埕案內紀年
              </h3>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-amber-300/80">
              <p>
                <strong>紀元：</strong>大正拾五年（一九二六年）夏 · 晴朗
              </p>
              <p>
                <strong>營業時辰：</strong>莊朝東客六日 · 待週二十六日 · 六月六日
              </p>
              <p>
                <strong>案內所現況：</strong>
                門庭若市，前來問道、平冤、求學、求緣與治病之信眾川流不息。
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-900/60 flex justify-end">
              <button
                onClick={() => setShowClockModal(false)}
                className="px-4 py-1.5 rounded bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold cursor-pointer"
              >
                收起時憲表
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit / Retire Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241a15] border-2 border-amber-700 rounded-xl max-w-lg w-full p-6 text-amber-100 shadow-2xl relative font-serif">
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-amber-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <DoorOpen className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-amber-200">
                退隱江湖 · 閉閣小憩
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-amber-300/80">
              <p>
                時值大正末期，大稻埕霞海香火與淡水河船鳴相應。案內所靈視之眼長明不滅。
              </p>
              <div className="bg-[#19110c] p-3 rounded border border-amber-900/50 space-y-1 text-stone-400">
                <div>企劃概念：模擬經營 × 動作解謎 × 妖怪公仔收集養成</div>
                <div>美術風格：日治和洋折衷（彩繪玻璃、復古花磚、巴洛克洋樓）</div>
                <div>製作小組：奇廟幻埕案內所製作組（一九二六年）</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-900/60 flex items-center justify-between gap-3">
              {onResetGame && (
                <button
                  onClick={() => {
                    sounds.playWoodFish();
                    onResetGame();
                    setShowExitModal(false);
                  }}
                  className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新開局修行</span>
                </button>
              )}
              <button
                onClick={() => setShowExitModal(false)}
                className="px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-100 text-xs font-bold cursor-pointer"
              >
                繼續營業
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
