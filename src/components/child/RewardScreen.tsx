import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { MASCOT_NAME } from '../../constants/app';
import { Star, RotateCcw, Home, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardScreen: React.FC = () => {
  const { selectedLesson, startLesson, navigateHome, recentBadgeUnlocked, clearRecentBadge } = useApp();

  useEffect(() => {
    // Grand celebration fanfare and star confetti burst!
    soundEffects.playRewardFanfare();
    voiceAssistant.speakCheer(`${MASCOT_NAME} says hooray! You earned 3 shiny stars!`);

    try {
      const end = Date.now() + 2 * 1000;
      const colors = ['#FFC93C', '#FF9F1C', '#4DA3E8', '#10B981', '#F43F5E'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // safe fallback
    }

    return () => {
      clearRecentBadge();
    };
  }, [clearRecentBadge]);

  const handleSingAgain = () => {
    soundEffects.playPop();
    if (selectedLesson) {
      startLesson(selectedLesson);
    } else {
      navigateHome();
    }
  };

  const handleHome = () => {
    soundEffects.playPop();
    navigateHome();
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[85vh] select-none">
      <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden animate-pop-in">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-white to-amber-50 pointer-events-none" />

        {/* Jumping Sparky Mascot Celebration */}
        <div className="relative mb-3 z-10">
          <img
            src="/sparky.png"
            alt={MASCOT_NAME}
            className="w-28 h-28 md:w-36 md:h-36 object-contain filter drop-shadow-xl animate-bounce"
          />
          <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">✨</div>
          <div className="absolute -bottom-1 -left-2 text-3xl animate-wiggle">🎉</div>
        </div>

        {/* Title */}
        <div className="z-10 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs md:text-sm mb-2 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Superstar Lesson Complete!</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-amber-950 leading-none">
            YOU DID IT!
          </h2>
          <p className="text-xs md:text-sm font-bold text-amber-800 mt-1">
            {selectedLesson ? `Great job singing "${selectedLesson.title}"!` : 'Awesome learning session!'}
          </p>
        </div>

        {/* 3 Golden Stars */}
        <div className="flex items-center justify-center gap-3 md:gap-4 my-3 z-10">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-400 border-3 border-yellow-500 shadow-md flex items-center justify-center animate-pop-in"
              style={{ animationDelay: `${starIdx * 150}ms` }}
            >
              <Star className="w-9 h-9 md:w-10 md:h-10 fill-amber-950 text-amber-950 animate-wiggle" />
            </div>
          ))}
        </div>

        <div className="z-10 mb-5">
          <span className="font-black text-amber-900 text-base md:text-lg">
            +3 Stars Added to Your Sparky Bank! 🌟
          </span>
        </div>

        {/* Unlocked Badge Card Notification */}
        {recentBadgeUnlocked && (
          <div className="z-10 mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 flex items-center gap-3 text-left animate-pop-in shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl border border-amber-300 flex-shrink-0">
              {recentBadgeUnlocked.emoji}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-300/60 px-2 py-0.5 rounded-full">
                New Badge Unlocked!
              </span>
              <h4 className="font-black text-amber-950 text-sm md:text-base leading-tight mt-0.5">
                {recentBadgeUnlocked.title}
              </h4>
              <p className="text-xs font-semibold text-amber-900 leading-snug">
                {recentBadgeUnlocked.description}
              </p>
            </div>
          </div>
        )}

        {/* Large Action Buttons (64px target) */}
        <div className="flex flex-col gap-3 z-10">
          <button
            onClick={handleSingAgain}
            className="w-full py-3.5 md:py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 border-3 border-amber-600 text-amber-950 font-black text-lg md:text-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 kid-btn-pop"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>SING AGAIN 🔁</span>
          </button>

          <button
            onClick={handleHome}
            className="w-full py-3.5 md:py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-3 border-emerald-700 text-white font-black text-lg md:text-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 kid-btn-pop"
          >
            <Home className="w-6 h-6 stroke-[2.5]" />
            <span>MORE SONGS 🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
};
