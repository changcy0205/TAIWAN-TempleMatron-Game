/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { DemonMonster, BattlePhase } from '../types/game';
import { sounds } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Shield, Flame, Swords, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExorcismBattleProps {
  monster: DemonMonster;
  onVictory: (monsterId: string) => void;
  onFlee: () => void;
}

export const ExorcismBattle: React.FC<ExorcismBattleProps> = ({
  monster,
  onVictory,
  onFlee,
}) => {
  const [phase, setPhase] = useState<BattlePhase>('shield_talisman');
  const [monsterHp, setMonsterHp] = useState<number>(monster.hp);
  const [shieldHp, setShieldHp] = useState<number>(monster.shieldHp);

  // Phase 1: Talisman Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [talismanProgress, setTalismanProgress] = useState<number>(0);
  const drawnPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Phase 2: QTE Weapon Combo state
  const [currentPromptWeapon, setCurrentPromptWeapon] = useState<'mirror' | 'bell' | 'sword'>('mirror');
  const [qteCombo, setQteCombo] = useState<number>(0);
  const [qteFeedback, setQteFeedback] = useState<string | null>(null);

  // Phase 3: Gourd Sealing state
  const [sealProgress, setSealProgress] = useState<number>(0);
  const [isSealingHold, setIsSealingHold] = useState<boolean>(false);
  const sealIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize canvas for Phase 1
  useEffect(() => {
    if (phase === 'shield_talisman') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw parchment talisman guidelines
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);

      // Star / Taoist sigil guideline
      ctx.beginPath();
      ctx.moveTo(150, 40);
      ctx.lineTo(230, 220);
      ctx.lineTo(60, 100);
      ctx.lineTo(240, 100);
      ctx.lineTo(70, 220);
      ctx.closePath();
      ctx.stroke();
    }
  }, [phase]);

  // Handle Talisman Drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    sounds.playTalismanStroke();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawnPointsRef.current = [{ x, y }];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawnPointsRef.current.push({ x, y });

    // Draw cinnabar red stroke
    ctx.setLineDash([]);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;

    const points = drawnPointsRef.current;
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Accumulate progress
    const nextProg = Math.min(100, talismanProgress + 1.2);
    setTalismanProgress(nextProg);

    if (nextProg >= 100) {
      setIsDrawing(false);
      sounds.playTalismanComplete();
      setShieldHp(0);
      setTimeout(() => {
        setPhase('weapon_qte');
      }, 700);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Phase 2: QTE Weapon Attack Trigger
  const handleWeaponClick = (weapon: 'mirror' | 'bell' | 'sword') => {
    sounds.playWeaponHit(weapon);

    const isMatch = weapon === currentPromptWeapon;
    const damage = isMatch ? 30 : 12;
    const newHp = Math.max(0, monsterHp - damage);
    setMonsterHp(newHp);

    if (isMatch) {
      setQteCombo((c) => c + 1);
      setQteFeedback('神威破煞！PERFECT!');
    } else {
      setQteFeedback('靈氣擊中！GOOD');
    }

    // Rotate weapon prompt
    const weapons: ('mirror' | 'bell' | 'sword')[] = ['mirror', 'bell', 'sword'];
    const nextW = weapons[Math.floor(Math.random() * weapons.length)];
    setCurrentPromptWeapon(nextW);

    if (newHp <= 15) {
      // Monster stunned, move to phase 3
      sounds.playDemonRoar();
      setTimeout(() => {
        setPhase('gourd_seal');
      }, 600);
    }
  };

  // Phase 3: Hold to seal with gourd
  const handleStartSealing = () => {
    setIsSealingHold(true);
    sounds.playGourdSeal();

    sealIntervalRef.current = setInterval(() => {
      setSealProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          if (sealIntervalRef.current) clearInterval(sealIntervalRef.current);
          sounds.playFigurineDrop();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          setPhase('victory');
          return 100;
        }
        return next;
      });
    }, 80);
  };

  const handleStopSealing = () => {
    setIsSealingHold(false);
    if (sealIntervalRef.current) {
      clearInterval(sealIntervalRef.current);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Top Threat Banner */}
      <div className="bg-[#2a1310] border-2 border-red-800/80 rounded-lg p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-950 text-red-200 border border-red-600 text-xs px-2 py-0.5 rounded font-mono">
              大凶 · 妖氣沖天
            </span>
            <h2 className="text-amber-100 font-bold font-serif text-lg">
              {monster.name} ({monster.japaneseName})
            </h2>
          </div>
          <p className="text-xs text-red-300/80 mt-1">
            {monster.title} · 執念反噬神力所化之妖物！請迅速依序破盾、連擊、封印！
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2 text-xs font-serif">
          <span
            className={`px-3 py-1 rounded border ${
              phase === 'shield_talisman'
                ? 'bg-amber-600 text-amber-100 border-amber-300 font-bold'
                : 'bg-stone-900 text-stone-500 border-stone-800'
            }`}
          >
            一、硃砂畫符破盾
          </span>
          <span
            className={`px-3 py-1 rounded border ${
              phase === 'weapon_qte'
                ? 'bg-amber-600 text-amber-100 border-amber-300 font-bold'
                : 'bg-stone-900 text-stone-500 border-stone-800'
            }`}
          >
            二、法器節奏連擊
          </span>
          <span
            className={`px-3 py-1 rounded border ${
              phase === 'gourd_seal' || phase === 'victory'
                ? 'bg-amber-600 text-amber-100 border-amber-300 font-bold'
                : 'bg-stone-900 text-stone-500 border-stone-800'
            }`}
          >
            三、封妖葫蘆收靈
          </span>
        </div>
      </div>

      {/* Main Arena Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left 6 Cols: Monster Display & HP Bars */}
        <div className="md:col-span-6 bg-[#1f1511] border border-amber-900/50 rounded-lg p-5 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col gap-3">
            {/* Health & Shield meters */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-red-400 font-bold">妖怪執念血量 (HP)</span>
                <span className="text-amber-200 tabular-nums">
                  {monsterHp} / {monster.maxHp}
                </span>
              </div>
              <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden border border-red-950">
                <div
                  className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300"
                  style={{ width: `${(monsterHp / monster.maxHp) * 100}%` }}
                />
              </div>

              {/* Shield Bar */}
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-purple-400 font-bold">怨氣煞氣護盾 (Shield)</span>
                <span className="text-purple-200 tabular-nums">
                  {shieldHp} / {monster.maxShieldHp}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-purple-950">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-indigo-500 transition-all duration-300"
                  style={{ width: `${(shieldHp / monster.maxShieldHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Monster Artwork Preview */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-red-900/60 bg-black mt-2">
              <img
                src={
                  phase === 'victory'
                    ? monster.spriteUrl
                    : '/assets/aistudio/Gemini_Generated_Image_78baj878baj878ba_9e3241b3.jpg'
                }
                alt={monster.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full transition-all duration-700 ${
                  phase === 'victory'
                    ? 'object-contain'
                    : 'object-cover'
                } ${
                  phase === 'gourd_seal' && isSealingHold
                    ? 'scale-90 opacity-60 filter hue-rotate-90 animate-spin'
                    : 'scale-100'
                }`}
              />

              {phase === 'weapon_qte' && qteFeedback && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-950/90 border border-amber-400 px-4 py-1.5 rounded text-amber-200 font-bold text-sm tracking-wider shadow-xl animate-bounce">
                  {qteFeedback} (連擊: {qteCombo})
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-900/40 text-xs text-amber-400/80">
            <span className="font-bold text-amber-300">妖化病灶：</span>
            <span>{monster.material}</span>
          </div>
        </div>

        {/* Right 6 Cols: Active Exorcism Mechanics for Current Phase */}
        <div className="md:col-span-6 bg-[#241c16] border border-amber-900/50 rounded-lg p-5 flex flex-col justify-between shadow-xl">
          {/* Phase 1: Talisman Drawing */}
          {phase === 'shield_talisman' && (
            <div className="flex flex-col items-center justify-between h-full gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>畫符破盾 · 天罡鎮妖敕令</span>
                </div>
                <p className="text-xs text-amber-400/70 mt-1">
                  請按滑鼠左鍵或手指在符布上一筆劃完五角星軌跡，灌注靈力擊碎妖怪護盾！
                </p>
              </div>

              {/* Drawing Canvas */}
              <div className="relative bg-parchment rounded-lg border-2 border-red-900 shadow-inner p-2">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={260}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="cursor-crosshair touch-none"
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-red-800 font-bold font-mono">
                  符法完成度: {Math.round(talismanProgress)}%
                </div>
              </div>

              <div className="w-full flex justify-between items-center text-xs text-amber-300">
                <span>筆觸順暢即可點燃靈火</span>
                <button
                  onClick={() => {
                    sounds.playTalismanComplete();
                    setShieldHp(0);
                    setPhase('weapon_qte');
                  }}
                  className="text-amber-500 hover:text-amber-300 underline text-xs cursor-pointer"
                >
                  【以法力速成符咒】
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: QTE Weapon Combo */}
          {phase === 'weapon_qte' && (
            <div className="flex flex-col items-center justify-between h-full gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <Swords className="w-4 h-4 text-amber-500" />
                  <span>結印與法器連擊 · 削弱妖力</span>
                </div>
                <p className="text-xs text-amber-400/70 mt-1">
                  依妖怪弱點提示，依序擊打「八卦鏡」、「金剛鈴」、「桃木劍」！
                </p>
              </div>

              {/* Current Prompt Target */}
              <div className="p-4 bg-[#1b1410] border-2 border-amber-500/70 rounded-xl text-center flex flex-col items-center gap-2 shadow-2xl">
                <span className="text-xs text-amber-400 uppercase tracking-widest font-mono">
                  目前最佳破煞法器：
                </span>
                <span className="text-2xl font-serif font-bold text-amber-200 animate-pulse">
                  {currentPromptWeapon === 'mirror' && '🪞 八卦照妖鏡 (照其本相)'}
                  {currentPromptWeapon === 'bell' && '🔔 降魔金剛鈴 (震碎煞魂)'}
                  {currentPromptWeapon === 'sword' && '🗡️ 辟邪桃木劍 (斬斷妄念)'}
                </span>
              </div>

              {/* 3 Interactive Weapon Buttons */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <button
                  onClick={() => handleWeaponClick('mirror')}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    currentPromptWeapon === 'mirror'
                      ? 'bg-amber-800/80 border-amber-300 text-amber-100 ring-2 ring-amber-400 shadow-lg scale-105'
                      : 'bg-[#2a1e17] border-amber-900/40 text-amber-300 hover:bg-[#38281e]'
                  }`}
                >
                  <span className="text-xl">🪞</span>
                  <span className="text-xs font-bold font-serif">八卦鏡</span>
                </button>

                <button
                  onClick={() => handleWeaponClick('bell')}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    currentPromptWeapon === 'bell'
                      ? 'bg-amber-800/80 border-amber-300 text-amber-100 ring-2 ring-amber-400 shadow-lg scale-105'
                      : 'bg-[#2a1e17] border-amber-900/40 text-amber-300 hover:bg-[#38281e]'
                  }`}
                >
                  <span className="text-xl">🔔</span>
                  <span className="text-xs font-bold font-serif">金剛鈴</span>
                </button>

                <button
                  onClick={() => handleWeaponClick('sword')}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    currentPromptWeapon === 'sword'
                      ? 'bg-amber-800/80 border-amber-300 text-amber-100 ring-2 ring-amber-400 shadow-lg scale-105'
                      : 'bg-[#2a1e17] border-amber-900/40 text-amber-300 hover:bg-[#38281e]'
                  }`}
                >
                  <span className="text-xl">🗡️</span>
                  <span className="text-xs font-bold font-serif">桃木劍</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-amber-500 font-mono">
                累積連擊次數: {qteCombo} 次 · 妖怪氣息急速衰竭
              </div>
            </div>
          )}

          {/* Phase 3: Gourd Sealing */}
          {phase === 'gourd_seal' && (
            <div className="flex flex-col items-center justify-between h-full gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>祭出紫金封妖葫蘆 · 實體化封印</span>
                </div>
                <p className="text-xs text-amber-400/70 mt-1">
                  按住下方封妖葫蘆不放，吸納殘餘怨念，將其壓縮凝聚為精巧之【妖怪公仔】！
                </p>
              </div>

              {/* Gourd Sealing Meter */}
              <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full bg-stone-900 border border-amber-800 rounded-full h-4 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-100"
                    style={{ width: `${sealProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  封印凝聚度: {sealProgress}%
                </span>
              </div>

              {/* Holdable Gourd Button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onMouseDown={handleStartSealing}
                  onMouseUp={handleStopSealing}
                  onTouchStart={handleStartSealing}
                  onTouchEnd={handleStopSealing}
                  className={`w-28 h-28 rounded-full border-4 transition-all flex flex-col items-center justify-center cursor-pointer shadow-2xl select-none ${
                    isSealingHold
                      ? 'border-yellow-400 bg-amber-700 scale-110 shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse'
                      : 'border-amber-600 bg-amber-950 hover:bg-amber-900'
                  }`}
                >
                  <span className="text-3xl">🏺</span>
                  <span className="text-xs font-serif font-bold text-amber-100 mt-1">
                    {isSealingHold ? '吸納封印中...' : '長按封妖'}
                  </span>
                </button>
                <span className="text-[11px] text-amber-500">
                  （按住葫蘆直至光華散發）
                </span>
              </div>

              <div className="text-stone-500 text-[10px]">
                神威所聚，白煙過後，戾氣盡化收藏珍玩。
              </div>
            </div>
          )}

          {/* Victory Viewport */}
          {phase === 'victory' && (
            <div className="flex flex-col items-center justify-between h-full gap-4 text-center">
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/80 rounded-lg w-full flex items-center justify-center gap-2 text-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>降妖大捷！已成功實體化封印！</span>
              </div>

              <div className="p-4 bg-[#1b1410] border-2 border-amber-700/80 rounded-lg flex flex-col items-center gap-2 max-w-sm">
                <span className="text-xs text-amber-500 font-mono">
                  【百鬼多寶格 · 獲得全新公仔】
                </span>
                <h3 className="font-serif font-bold text-amber-200 text-lg">
                  {monster.name}
                </h3>
                <span className="text-xs text-amber-400/90 font-serif">
                  靈障加護：【{monster.buffName}】
                </span>
                <p className="text-[11px] text-amber-300/80 leading-relaxed mt-1">
                  {monster.buffDescription}
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playFigurineDrop();
                  onVictory(monster.id);
                }}
                className="w-full py-3 rounded font-serif font-bold text-xs bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-amber-100 shadow-xl border border-amber-300/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>收納入百鬼多寶格陳列櫃</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
