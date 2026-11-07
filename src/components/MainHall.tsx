/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NpcDevotee, DeityId, ShrineItem } from '../types/game';
import { DEITIES } from '../data/gameData';
import { sounds } from '../services/soundEffects';
import { Search, Sparkles, AlertCircle, ArrowRight, CheckCircle2, ChevronRight, PackageOpen } from 'lucide-react';
import { KeeperFooterBar } from './KeeperFooterBar';

interface MainHallProps {
  currentDevotee: NpcDevotee;
  currentTrayItems: ShrineItem[];
  discoveredClues: string[];
  onDiscoverClue: (clueId: string) => void;
  onGuideToShrine: (deityId: DeityId) => void;
  onOpenShop: () => void;
  onOpenTalisman?: () => void;
  onOpenCabinet?: () => void;
  onNextDevotee: () => void;
  hasActiveDemon: boolean;
}

export const MainHall: React.FC<MainHallProps> = ({
  currentDevotee,
  currentTrayItems,
  discoveredClues,
  onDiscoverClue,
  onGuideToShrine,
  onOpenShop,
  onOpenTalisman,
  onOpenCabinet,
  onNextDevotee,
  hasActiveDemon,
}) => {
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<{ sender: 'keeper' | 'npc'; text: string }[]>([
    { sender: 'npc', text: currentDevotee.surfaceGoal },
  ]);
  const [selectedDeityToAssign, setSelectedDeityToAssign] = useState<DeityId | null>(null);

  const characterImage = '/assets/aistudio/Gemini_Generated_Image_n25k3zn25k3zn25k_442f5cc5.jpg';

  const handleSelectOption = (idx: number) => {
    sounds.playWoodFish();
    const opt = currentDevotee.options[idx];
    if (!opt) return;

    setChatLog((prev) => [
      ...prev,
      { sender: 'keeper', text: opt.text },
      { sender: 'npc', text: opt.response },
      { sender: 'keeper', text: opt.keeperReply },
    ]);

    if (opt.revealsClueId) {
      onDiscoverClue(opt.revealsClueId);
      sounds.playInspect();
    }
  };

  const handleInspectHotspot = (clueId: string) => {
    sounds.playInspect();
    onDiscoverClue(clueId);
    setSelectedClue(clueId);
  };

  const handleConfirmShrine = () => {
    if (!selectedDeityToAssign) return;
    sounds.playBwaBwei();
    onGuideToShrine(selectedDeityToAssign);
  };

  // Determine contextual footer dialogue
  const footerDialogue =
    discoveredClues.length > 0
      ? `已探知此信眾的真實執念與「${currentDevotee.clues.find((c) => discoveredClues.includes(c.id))?.label}」有關。不可引錯神龕，否則恐引發神力反噬！`
      : `這孩子心神不寧，身上的『念』隱有異狀。請仔細詢問，或開啟【靈視放大鏡】探察其隨身細節……`;

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Top Banner / Scenario Context */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#231a15] border border-amber-900/50 rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full border-2 border-amber-500/60 overflow-hidden shadow-md shrink-0 bg-stone-900">
            <img
              src="/assets/aistudio/Replace_character_1_2bd99895.jpg"
              alt="靈視廟婆"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-200 font-bold font-serif text-base">靈視廟婆 · 案內指引</span>
              <span className="text-xs text-amber-500 border border-amber-800/60 px-2 py-0.5 rounded">
                迎客解謎中
              </span>
            </div>
            <p className="text-xs text-amber-300/80 mt-1 max-w-xl">
              善男信女常帶隱衷而來。請以對話審度其言，或以【靈視放大鏡】探照其身。切勿引錯神位，免生心魔孽怪！
            </p>
          </div>
        </div>

        {/* Action Controls for Magnifier & Shop */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              sounds.playInspect();
              setInspectMode(!inspectMode);
            }}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-serif font-bold transition-all cursor-pointer border ${
              inspectMode
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                : 'bg-amber-950/70 hover:bg-amber-900/70 text-amber-200 border-amber-700/60'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>{inspectMode ? '關閉靈視觀照' : '開啟靈視放大鏡'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playWoodFish();
              onOpenShop();
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-serif font-bold bg-[#38261b] hover:bg-[#4a3426] text-amber-100 border border-amber-700/50 shadow transition-colors cursor-pointer"
          >
            <PackageOpen className="w-4 h-4 text-amber-400" />
            <span>前往販賣部打包供品 ({currentTrayItems.length})</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left (Devotee Viewport & Clue Scanner) | Right (Dialogue & Shrine Assignment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Scene & Magnifier Hotspots */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/9] rounded-lg border-2 border-amber-900/60 overflow-hidden bg-black shadow-2xl">
            {/* Background Temple Main Screen */}
            <img
              src={
                inspectMode
                  ? '/assets/aistudio/Gemini_Generated_Image_tjmzrxtjmzrxtjmz_cd85f7ae.jpg'
                  : '/assets/aistudio/Replace_character_in_image_cd2244d9_ca47311a.jpg'
              }
              alt="奇廟幻埕案內所主畫面"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                inspectMode ? 'scale-105 filter brightness-105' : 'scale-100'
              }`}
            />

            {/* Clickable Image Overlays (When not in inspect mode) */}
            {!inspectMode && (
              <>
                {/* Hotspot on the in-image magnifying glass icon on devotee */}
                <button
                  onClick={() => {
                    sounds.playInspect();
                    setInspectMode(true);
                  }}
                  style={{ left: '32.5%', top: '54.5%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-500/30 hover:bg-emerald-500/60 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse flex items-center justify-center z-10"
                  title="點擊開啟靈視放大鏡探查此信眾"
                >
                  <Search className="w-4 h-4 text-emerald-200" />
                </button>

                {/* Hotspot on bottom-right '進貨帳本' tab in the painting */}
                <button
                  onClick={() => {
                    sounds.playWoodFish();
                    onOpenShop();
                  }}
                  style={{ right: '14%', bottom: '15%' }}
                  className="absolute w-8 h-20 opacity-0 hover:opacity-100 bg-amber-500/20 border border-amber-400/60 rounded transition-all cursor-pointer z-10"
                  title="翻閱進貨帳本 / 前往販賣部"
                />

                {/* Hotspot on bottom-right '百鬼多寶格' tab in the painting */}
                {onOpenCabinet && (
                  <button
                    onClick={() => {
                      sounds.playWoodFish();
                      onOpenCabinet();
                    }}
                    style={{ right: '9%', bottom: '15%' }}
                    className="absolute w-8 h-20 opacity-0 hover:opacity-100 bg-amber-500/20 border border-amber-400/60 rounded transition-all cursor-pointer z-10"
                    title="前往百鬼多寶格陳列櫃"
                  />
                )}
              </>
            )}

            {/* Spiritual Overlay if in Inspect Mode */}
            {inspectMode && (
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] pointer-events-none">
                <div className="absolute top-4 left-4 bg-black/75 border border-emerald-500/80 px-3 py-1.5 rounded text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>靈視鏡運轉中：點擊發光執念圈以探查真意</span>
                </div>
              </div>
            )}

            {/* Interactive Hotspots for Clues */}
            {inspectMode &&
              currentDevotee.clues.map((clue) => {
                const isFound = discoveredClues.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    onClick={() => handleInspectHotspot(clue.id)}
                    style={{ left: `${clue.xPct}%`, top: `${clue.yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                    title={clue.part}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isFound
                          ? 'border-emerald-400 bg-emerald-900/70 text-emerald-200'
                          : 'border-amber-400 bg-amber-500/30 text-amber-200 animate-ping'
                      }`}
                    >
                      <Search className="w-5 h-5 text-amber-200 group-hover:scale-125 transition-transform" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-amber-200 text-[10px] px-2 py-0.5 rounded border border-amber-800">
                      {clue.part}
                    </span>
                  </button>
                );
              })}

            {/* Devotee Info Tag on Scene Bottom */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#1e1713]/90 border border-amber-900/80 p-3 rounded backdrop-blur-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-200 font-bold font-serif">{currentDevotee.name}</span>
                  <span className="text-[11px] text-amber-400/80 font-mono">
                    [{currentDevotee.identity}]
                  </span>
                </div>
                <p className="text-xs text-amber-300/70 mt-0.5 line-clamp-1">
                  {currentDevotee.appearance}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-500 uppercase tracking-wider block">已查明線索</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {currentDevotee.clues.filter((c) => discoveredClues.includes(c.id)).length} /{' '}
                  {currentDevotee.clues.length}
                </span>
              </div>
            </div>
          </div>

          {/* Discovered Clues Dossier Cards */}
          <div className="bg-[#241c16] border border-amber-900/40 rounded-lg p-4">
            <h4 className="text-xs font-serif text-amber-400 font-bold flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>靈視偵查卷宗 · 執念線索</span>
            </h4>

            {discoveredClues.length === 0 ? (
              <p className="text-xs text-amber-400/50 italic py-2">
                尚未查出深層執念。可透過與信眾交談，或開啟【靈視放大鏡】探查其身物細節。
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDevotee.clues
                  .filter((c) => discoveredClues.includes(c.id))
                  .map((clue) => (
                    <div
                      key={clue.id}
                      className="bg-[#2d221b] border border-amber-800/60 p-2.5 rounded text-xs text-amber-200"
                    >
                      <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                        <span>{clue.label}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">【真意揭露】</span>
                      </div>
                      <p className="text-amber-300/80 text-[11px] leading-relaxed">
                        {clue.description}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dialogue Conversation & Shrine Guidance Selection */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dialogue Transcript Container */}
          <div className="bg-[#211914] border border-amber-900/50 rounded-lg p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2 mb-3">
              <span className="text-xs font-serif font-bold text-amber-300">本堂諮詢紀錄</span>
              <span className="text-[10px] text-amber-600 font-mono">大稻埕六月廿二日</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 text-xs">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded leading-relaxed ${
                    msg.sender === 'keeper'
                      ? 'bg-amber-950/50 border border-amber-800/40 text-amber-200 self-end ml-4'
                      : 'bg-stone-900/70 border border-stone-800 text-stone-200 self-start mr-4'
                  }`}
                >
                  <span className="block text-[10px] text-amber-500 font-bold mb-0.5">
                    {msg.sender === 'keeper' ? '【靈視廟婆】' : `【${currentDevotee.name}】`}
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Conversation Inquiries */}
            <div className="mt-3 pt-3 border-t border-amber-900/40 flex flex-col gap-1.5">
              <span className="text-[11px] text-amber-400 font-bold">深入刺探話題：</span>
              <div className="flex flex-col gap-1">
                {currentDevotee.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="text-left text-xs bg-[#2e2118] hover:bg-[#3d2c20] border border-amber-800/50 text-amber-200 p-2 rounded transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shrine Assignment & Packaged Offerings Summary */}
          <div className="bg-[#241c16] border border-amber-900/50 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold text-amber-300">
                引導神龕與供品核驗
              </h4>
              <span className="text-[11px] text-amber-400 font-mono">
                托盤供品：{currentTrayItems.length} 件
              </span>
            </div>

            {/* Current Tray Overview */}
            <div className="p-2.5 bg-[#1b1410] border border-amber-900/60 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {currentTrayItems.length === 0 ? (
                  <span className="text-stone-500 italic text-[11px]">
                    尚未在販賣部打包祭拜用品
                  </span>
                ) : (
                  currentTrayItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-amber-950/80 border border-amber-800 text-amber-200 text-[11px] rounded whitespace-nowrap"
                    >
                      {item.icon} {item.name}
                    </span>
                  ))
                )}
              </div>
              <button
                onClick={onOpenShop}
                className="text-[11px] text-amber-400 underline hover:text-amber-200 shrink-0 ml-2 cursor-pointer"
              >
                增補供品
              </button>
            </div>

            {/* 5 Shrines Radio Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(Object.keys(DEITIES) as DeityId[]).map((dId) => {
                const deity = DEITIES[dId];
                const isSelected = selectedDeityToAssign === dId;
                return (
                  <button
                    key={dId}
                    onClick={() => {
                      sounds.playWoodFish();
                      setSelectedDeityToAssign(dId);
                    }}
                    className={`p-2.5 rounded border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-amber-900/60 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                        : 'bg-[#1e1713] border-amber-900/40 text-amber-300/80 hover:bg-[#2b1f18]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-serif font-bold text-amber-200">
                      <span>{deity.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-amber-500 line-clamp-1">{deity.domain}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit Guidance Button */}
            <button
              onClick={handleConfirmShrine}
              disabled={!selectedDeityToAssign}
              className={`w-full py-2.5 rounded font-serif font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedDeityToAssign
                  ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-600 text-amber-100 shadow-lg border border-amber-400/50'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
              }`}
            >
              <span>引導信眾前往【{selectedDeityToAssign ? DEITIES[selectedDeityToAssign].name : '選擇神龕'}】上香祝禱</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-amber-600 text-center">
              *注意：若神龕與信眾真正執念相悖，將立刻引發香火逆流妖化！
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Keeper Dialogue Bar with Uploaded Character Art */}
      <KeeperFooterBar
        dialogueText={footerDialogue}
        speakerName="廟婆"
        onOpenInspect={() => setInspectMode(!inspectMode)}
        onOpenTalisman={onOpenTalisman}
        isInspectActive={inspectMode}
        extraButtons={[
          {
            label: '【肆】詢問學業/訴求',
            onClick: () => handleSelectOption(0),
          },
          {
            label: '【伍】探尋隱情',
            onClick: () => handleSelectOption(1),
          },
          {
            label: '【陸】靈視觀念',
            onClick: () => {
              handleSelectOption(2);
              setInspectMode(true);
            },
            active: inspectMode,
          },
        ]}
      />
    </div>
  );
};
