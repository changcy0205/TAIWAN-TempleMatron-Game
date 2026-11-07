/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShrineItem, ItemCategory } from '../types/game';
import { sounds } from '../services/soundEffects';
import { ShoppingBag, Plus, Minus, ArrowLeft, Receipt, RefreshCw, Check, Sparkles } from 'lucide-react';
import { KeeperFooterBar } from './KeeperFooterBar';

interface ShopCounterProps {
  inventory: ShrineItem[];
  trayItems: ShrineItem[];
  money: number;
  onAddToTray: (item: ShrineItem) => void;
  onRemoveFromTray: (index: number) => void;
  onClearTray: () => void;
  onRestock: (itemId: string, amount: number, totalCost: number) => void;
  onBackToHall: () => void;
}

export const ShopCounter: React.FC<ShopCounterProps> = ({
  inventory,
  trayItems,
  money,
  onAddToTray,
  onRemoveFromTray,
  onClearTray,
  onRestock,
  onBackToHall,
}) => {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [showRestockLedger, setShowRestockLedger] = useState<boolean>(false);
  const [receiptSuccess, setReceiptSuccess] = useState<boolean>(false);

  const categories: { id: ItemCategory | 'all'; label: string }[] = [
    { id: 'all', label: '全部供品' },
    { id: 'incense', label: '香火柱燭' },
    { id: 'joss_paper', label: '神明金紙' },
    { id: 'talisman_special', label: '靈符信物' },
    { id: 'food_tribute', label: '牲果素品' },
  ];

  const filteredItems = inventory.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const trayTotal = trayItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleCheckoutAndRing = () => {
    sounds.playCashRegister();
    setReceiptSuccess(true);
    setTimeout(() => {
      setReceiptSuccess(false);
    }, 2500);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Top Bar with Navigation & Cash Register Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#231a15] border border-amber-900/50 rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playWoodFish();
              onBackToHall();
            }}
            className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300 hover:text-amber-100 bg-[#35251b] border border-amber-700/60 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回案內大廳</span>
          </button>
          <span className="text-amber-100 font-bold font-serif text-base">
            廟宇供品販賣部 · 櫃台出單
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playWoodFish();
              setShowRestockLedger(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-serif font-bold bg-[#3b2719] hover:bg-[#4f3422] text-amber-200 border border-amber-700/70 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>翻閱進貨帳本</span>
          </button>

          <div className="bg-[#1b1410] border border-amber-800/60 px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span className="text-amber-400">目前庫存資金:</span>
            <span className="text-amber-200 font-mono font-bold tabular-nums">
              {money.toLocaleString()} 日圓
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Left Shelf & Items | Right Tray & Cash Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Shelves & Items */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playWoodFish();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded text-xs font-serif whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-900/60 text-amber-100 border border-amber-600 font-bold shadow'
                    : 'bg-[#221813] text-amber-400/80 hover:bg-amber-950/40 border border-amber-950'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Shelves Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredItems.map((item) => {
              const inTrayCount = trayItems.filter((t) => t.id === item.id).length;
              const isOutOfStock = item.stock <= 0;
              return (
                <div
                  key={item.id}
                  className={`bg-[#261d17] border rounded-lg p-3.5 flex flex-col justify-between transition-all shadow ${
                    isOutOfStock
                      ? 'border-red-900/40 opacity-60'
                      : 'border-amber-900/40 hover:border-amber-700/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-serif font-bold text-amber-100 text-xs line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-500 font-mono">
                            【{item.symbolism}】
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                        {item.price}円
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-300/70 leading-relaxed line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between">
                    <span className="text-[10px] text-amber-400/70 font-mono">
                      在庫: {item.stock} {item.unit}
                    </span>

                    <button
                      onClick={() => {
                        sounds.playWoodFish();
                        onAddToTray(item);
                      }}
                      disabled={isOutOfStock}
                      className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isOutOfStock
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-amber-900/60 hover:bg-amber-800/70 text-amber-100 border border-amber-700/70 shadow'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>裝入托盤 {inTrayCount > 0 ? `(${inTrayCount})` : ''}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Packaging Lacquer Tray & Cash Register */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Packaging Tray Display */}
          <div className="bg-[#2a1d17] border-2 border-amber-900/70 rounded-lg p-4 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-900/50 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-800 border border-red-500" />
                <h3 className="text-xs font-serif font-bold text-amber-200">
                  硃漆供品打包托盤
                </h3>
              </div>
              {trayItems.length > 0 && (
                <button
                  onClick={() => {
                    sounds.playWoodFish();
                    onClearTray();
                  }}
                  className="text-[10px] text-amber-500 hover:text-amber-300 cursor-pointer"
                >
                  清空托盤
                </button>
              )}
            </div>

            {/* Tray List */}
            <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-2">
              {trayItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8 text-stone-500">
                  <ShoppingBag className="w-8 h-8 opacity-40 mb-1" />
                  <span className="text-xs font-serif">托盤空無一物</span>
                  <span className="text-[10px] text-stone-600">
                    請由左方陳列架挑選對應神明的香火供品
                  </span>
                </div>
              ) : (
                trayItems.map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    className="flex items-center justify-between bg-[#1f1511] border border-amber-900/40 p-2 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <span className="text-amber-200 font-serif">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono">{t.price}円</span>
                      <button
                        onClick={() => {
                          sounds.playWoodFish();
                          onRemoveFromTray(idx);
                        }}
                        className="text-stone-400 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tray Cost Calculation & Vintage Cash Register Ring Button */}
            <div className="mt-3 pt-3 border-t border-amber-900/60 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400">供品合算總額:</span>
                <span className="text-amber-100 font-bold text-sm tabular-nums">
                  {trayTotal} 日圓
                </span>
              </div>

              <button
                onClick={handleCheckoutAndRing}
                disabled={trayItems.length === 0}
                className={`py-2.5 rounded font-serif font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  trayItems.length > 0
                    ? 'bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-700 hover:from-amber-600 hover:to-yellow-600 text-amber-100 border border-amber-400/60'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>敲響老式收銀機 · 打印手寫受取書</span>
              </button>

              {receiptSuccess && (
                <div className="bg-emerald-950/80 border border-emerald-500/70 p-2.5 rounded text-center text-xs text-emerald-200 animate-bounce">
                  叮～收銀機抽屜開啟！手寫受取書已存檔，供品已備妥托盤！
                </div>
              )}
            </div>
          </div>

          {/* Vintage Handwritten Receipt Visual Component */}
          <div className="bg-parchment text-[#2b201a] p-4 rounded-lg border-2 border-[#8c6f4f] shadow-lg text-xs font-serif relative">
            <div className="absolute top-2 right-2 border-2 border-red-800 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold rotate-6 uppercase">
              奇廟幻埕案內所印
            </div>
            <h4 className="font-bold text-center text-sm border-b border-[#a89078] pb-1 mb-2">
              手寫收據（案內所受取書）
            </h4>
            <div className="text-[11px] flex flex-col gap-1 mb-2">
              <div className="flex justify-between border-b border-dashed border-[#c0a892] pb-0.5">
                <span>品名</span>
                <span>奉納額</span>
              </div>
              {trayItems.length === 0 ? (
                <span className="text-stone-500 italic py-1">托盤無項目</span>
              ) : (
                trayItems.slice(0, 5).map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{t.name}</span>
                    <span className="font-mono">{t.price} 円</span>
                  </div>
                ))
              )}
              {trayItems.length > 5 && (
                <span className="text-[10px] text-stone-600">
                  ...其餘供品共 {trayItems.length - 5} 件
                </span>
              )}
            </div>
            <div className="border-t border-[#8c6f4f] pt-1 flex justify-between font-bold">
              <span>合計金額</span>
              <span className="font-mono text-sm">{trayTotal} 日圓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restock Ledger Modal (進貨帳本) */}
      {showRestockLedger && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241c16] border-2 border-amber-900/80 rounded-lg max-w-2xl w-full p-5 text-amber-100 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-amber-200">
                  大稻埕進貨帳本 · 供品撥款補貨
                </h3>
              </div>
              <button
                onClick={() => setShowRestockLedger(false)}
                className="text-stone-400 hover:text-stone-200 cursor-pointer text-sm"
              >
                關閉
              </button>
            </div>

            <p className="text-xs text-amber-300/80">
              進貨價低於販售價，合理進貨可確保信眾參拜時供品無缺，獲取豐厚香油錢與利潤。
            </p>

            <div className="max-h-[380px] overflow-y-auto flex flex-col gap-2 pr-1">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#1c1410] border border-amber-900/40 p-2.5 rounded text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="font-serif font-bold text-amber-200">{item.name}</span>
                      <div className="text-[10px] text-amber-500 font-mono">
                        進價: {item.cost}円 / 售價: {item.price}円 · 庫存: {item.stock} {item.unit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (money >= item.cost * 5) {
                          sounds.playCashRegister();
                          onRestock(item.id, 5, item.cost * 5);
                        }
                      }}
                      disabled={money < item.cost * 5}
                      className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 rounded text-[11px] font-mono cursor-pointer disabled:opacity-40"
                    >
                      補 5 件 ({item.cost * 5}円)
                    </button>
                    <button
                      onClick={() => {
                        if (money >= item.cost * 10) {
                          sounds.playCashRegister();
                          onRestock(item.id, 10, item.cost * 10);
                        }
                      }}
                      disabled={money < item.cost * 10}
                      className="px-2.5 py-1 bg-amber-900 hover:bg-amber-800 border border-amber-600 text-amber-100 rounded text-[11px] font-mono cursor-pointer disabled:opacity-40"
                    >
                      批量 10 件 ({item.cost * 10}円)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Keeper Dialogue Bar with Uploaded Character Art */}
      <KeeperFooterBar
        dialogueText="請依信眾需求，將合適的香火與供品拖曳至托盤中打包。若庫存不足，可翻閱【進貨帳本】向大稻埕商行補貨。"
        speakerName="廟婆"
        extraButtons={[
          {
            label: '結帳出單',
            onClick: handleCheckoutAndRing,
            active: trayItems.length > 0,
          },
          {
            label: '進貨帳本',
            onClick: () => setShowRestockLedger(true),
          },
          {
            label: '返回案內大廳',
            onClick: onBackToHall,
          },
        ]}
      />
    </div>
  );
};
