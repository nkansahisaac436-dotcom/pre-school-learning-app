import React, { useState } from 'react';
import type { StickerItem } from '../../types';
import { INITIAL_STICKERS } from '../../data/initialContent';
import { musicEngine } from '../../services/musicEngine';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unlockedStickerIds: string[];
}

export const StickerBookModal: React.FC<Props> = ({ isOpen, onClose, unlockedStickerIds }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'letters' | 'numbers' | 'colors' | 'shapes' | 'animals' | 'sparky'>('all');

  if (!isOpen) return null;

  const filteredStickers = INITIAL_STICKERS.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleStickerTap = (sticker: StickerItem, isUnlocked: boolean) => {
    if (isUnlocked) {
      musicEngine.playStarChime();
      voiceAssistant.speak(`${sticker.title}! ${sticker.description}`);
    } else {
      musicEngine.playPop();
      voiceAssistant.speak(`Keep singing and playing to unlock ${sticker.title}!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-3xl bg-gradient-to-b from-amber-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-amber-400 relative text-gray-800 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            musicEngine.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-amber-900 text-xl font-bold shadow-sm active:scale-95"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center pb-3 border-b-2 border-amber-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-sm mb-1 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>🌟 My Sparkling Sticker Album</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-900">
            Collect Stickers by Singing & Playing!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Unlocked {unlockedStickerIds.length} of {INITIAL_STICKERS.length} Stickers
          </p>

          {/* Category Tabs */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: 'all', label: 'All Stickers', emoji: '⭐' },
              { id: 'sparky', label: 'Sparky', emoji: '✨' },
              { id: 'letters', label: 'Letters', emoji: '🔤' },
              { id: 'numbers', label: 'Numbers', emoji: '💯' },
              { id: 'colors', label: 'Colors', emoji: '🎨' },
              { id: 'shapes', label: 'Shapes', emoji: '🔷' },
              { id: 'animals', label: 'Animals', emoji: '🐮' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  musicEngine.playPop();
                  setSelectedCategory(tab.id as typeof selectedCategory);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs md:text-sm transition flex items-center gap-1 border ${
                  selectedCategory === tab.id
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm scale-105'
                    : 'bg-white/80 text-gray-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stickers Grid */}
        <div className="overflow-y-auto flex-1 p-2 md:p-4 my-2 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {filteredStickers.map((sticker) => {
            const isUnlocked = unlockedStickerIds.includes(sticker.id);
            return (
              <button
                key={sticker.id}
                onClick={() => handleStickerTap(sticker, isUnlocked)}
                className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition transform active:scale-95 text-center shadow-md ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-100 to-white border-amber-300 hover:border-amber-400 hover:scale-105'
                    : 'bg-gray-100 border-gray-300 opacity-60'
                }`}
              >
                <div className="relative">
                  <span className={`text-5xl filter ${isUnlocked ? 'drop-shadow-md' : 'grayscale contrast-50'}`}>
                    {sticker.emoji}
                  </span>
                  {isUnlocked && sticker.rarity === 'super_star' && (
                    <span className="absolute -top-1 -right-2 text-xs bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full border border-amber-500 animate-pulse">
                      STAR
                    </span>
                  )}
                </div>
                <h4 className="font-black text-sm md:text-base text-gray-900 mt-1">
                  {isUnlocked ? sticker.title : '??? Locked'}
                </h4>
                <p className="text-xs text-gray-500 font-semibold line-clamp-1">
                  {isUnlocked ? sticker.description : 'Finish songs to unlock!'}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
