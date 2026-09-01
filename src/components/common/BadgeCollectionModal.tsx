import React from 'react';
import { useApp } from '../../context/AppContext';
import { BADGES } from '../../data/initialContent';
import { X, Trophy, Sparkles, Lock } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';

export const BadgeCollectionModal: React.FC = () => {
  const { isBadgeModalOpen, closeBadgeModal, activeProfile } = useApp();

  if (!isBadgeModalOpen) return null;

  const handleBadgeTap = (title: string, description: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      soundEffects.playSparkleStar();
      voiceAssistant.speak(`Badge earned! ${title}! ${description}`);
    } else {
      soundEffects.playPop();
      voiceAssistant.speak(`Keep singing and playing to unlock the ${title} badge!`);
    }
  };

  const unlockedCount = activeProfile.badgesEarned.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-xl bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 relative text-gray-800 max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={closeBadgeModal}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-amber-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-amber-100">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-sm mb-2 border border-amber-300">
            <Trophy className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>{activeProfile.name}'s Sticker Trophy Book</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-950">
            🌟 {activeProfile.starsCount} Stars Collected!
          </h2>
          <p className="text-sm text-amber-800 font-semibold mt-1">
            Tap a badge to hear its special story! ({unlockedCount}/{BADGES.length} unlocked)
          </p>
        </div>

        {/* Badge Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = activeProfile.badgesEarned.includes(badge.id);

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => handleBadgeTap(badge.title, badge.description, isUnlocked)}
                className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center transition kid-btn-pop relative ${
                  isUnlocked
                    ? `bg-gradient-to-br ${badge.color} text-white border-white shadow-lg`
                    : 'bg-gray-100 border-gray-300 text-gray-400 opacity-60'
                }`}
              >
                {isUnlocked ? (
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-inner mb-2 animate-bounce-slow">
                    {badge.emoji}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl mb-2 grayscale">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <div className="font-black text-sm leading-tight drop-shadow-sm">
                  {badge.title}
                </div>

                <div className="text-xs mt-1 font-medium line-clamp-2 opacity-90">
                  {isUnlocked ? badge.description : 'Locked'}
                </div>

                {isUnlocked && (
                  <span className="absolute top-2 right-2 text-xs">⭐</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Home / Done Button */}
        <div className="pt-3 border-t-2 border-amber-100">
          <button
            type="button"
            onClick={closeBadgeModal}
            className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 border-3 border-amber-600 text-amber-950 font-black text-lg shadow-md kid-btn-pop transition"
          >
            Keep Playing! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
