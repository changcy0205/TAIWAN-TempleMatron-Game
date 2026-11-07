/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DEITIES } from '../data/gameData';
import { sounds } from '../services/soundEffects';
import { BookOpen, Sparkles, Shield, X, HelpCircle } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#241c16] border-2 border-amber-800/80 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col text-amber-100 shadow-2xl font-serif">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-900/60 bg-[#1c1410]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-amber-200">
              廟務營運手冊 · 《大正大稻埕鄉野案內錄》
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playWoodFish();
              onClose();
            }}
            className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 text-xs leading-relaxed">
          {/* Section 1: 核心故事與背景 */}
          <div className="bg-[#1c1511] border border-amber-900/40 p-4 rounded-lg flex flex-col gap-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>日治大正時期 · 隱秘廟宇的靈視廟婆</span>
            </h4>
            <p className="text-amber-300/80">
              時值大正末期（一九二六年），大稻埕商行雲集，巴洛克洋樓與紅磚閩南廟宇林立。在洋行買辦、帝國大學學生、日本巡查與傳統居民交織的時代，許多人心中埋藏著難以啟齒的深沉執念。
            </p>
            <p className="text-amber-300/80">
              玩家扮演擁有「靈視」能力的廟婆，需藉由對話辨別信眾的真假訴求，並使用【靈視放大鏡】探查其隨身物品，引導至正確的神明神龕。
            </p>
          </div>

          {/* Section 2: 五大神明與正道供品對應表 */}
          <div className="bg-[#1c1511] border border-amber-900/40 p-4 rounded-lg flex flex-col gap-3">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>五大神龕適用需求、必備祭品與妖化結果</span>
            </h4>

            <div className="flex flex-col gap-3">
              {Object.values(DEITIES).map((d) => (
                <div
                  key={d.id}
                  className="bg-[#261d17] border border-amber-900/50 p-3 rounded flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200 text-xs">
                      【{d.name}】—— {d.title}
                    </span>
                    <span className="text-[10px] text-red-400 font-mono">
                      錯拜異變：{d.misfitDemon}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400/80">
                    <span className="text-amber-500 font-bold">適用願求：</span>
                    {d.domain}
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    <span className="text-emerald-500 font-bold">正統供品：</span>
                    {d.recommendedOfferings.join('、')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 降妖伏魔與百鬼多寶格 */}
          <div className="bg-[#1c1511] border border-amber-900/40 p-4 rounded-lg flex flex-col gap-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>降妖三儀式與公仔被動加護</span>
            </h4>
            <ul className="list-disc list-inside text-amber-300/80 flex flex-col gap-1.5 pl-1">
              <li>
                <strong>一、畫符破盾：</strong>
                在符布上沿著天罡引導線一筆畫完五角星陣，引爆火光破除妖怪護盾。
              </li>
              <li>
                <strong>二、法器連擊：</strong>
                根據畫面弱點提示，依序擊打「八卦鏡」、「金剛鈴」、「桃木劍」，削弱血量。
              </li>
              <li>
                <strong>三、葫蘆封妖：</strong>
                長按紫金封妖葫蘆，旋渦吸納怨氣，將其壓縮實體化為【妖怪公仔】！
              </li>
              <li>
                <strong>四、百鬼多寶格養成：</strong>
                收服的公仔陳列於展示櫃中，各具強大加護（如增加文昌帝君香油錢、進貨成本折扣等），可消耗香油錢升級！
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1c1410] border-t border-amber-900/60 flex justify-end">
          <button
            onClick={() => {
              sounds.playWoodFish();
              onClose();
            }}
            className="px-5 py-2 rounded text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600 transition-colors cursor-pointer"
          >
            知悉，返回廟務
          </button>
        </div>
      </div>
    </div>
  );
};
