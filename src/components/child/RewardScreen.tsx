import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';

export const RewardScreen: React.FC = () => {
  const {
    activeProfile,
    recentBadgeUnlocked,
    clearRecentBadge,
    setScreen,
    openBadgeModal,
  } = useApp();

  useEffect(() => {
    // Fanfare and double confetti blast
    soundEffects.playRewardFanfare();

    const end = Date.now() + 1500;
    const interval = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(interval);
        return;
      }
      try {
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random() * 0.4 + 0.3,
            y: Math.random() * 0.4 + 0.2,
          },
          colors: ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981', '#a855f7'],
        });
      } catch {
        // Safe ignore
      }
    }, 300);

    const voiceMsg = recentBadgeUnlocked
      ? `Hooray! You earned the ${recentBadgeUnlocked.title} badge and 3 golden stars!`
      : `Super job! You earned 3 shiny stars!`;
    voiceAssistant.speak(voiceMsg);

    return () => {
      window.clearInterval(interval);
    };
  }, [recentBadgeUnlocked]);

  const handleSingAgain = () => {
    clearRecentBadge();
    soundEffects.playPop();
    setScreen('lesson-player');
  };

  const handleGoHome = () => {
    clearRecentBadge();
    soundEffects.playPop();
    setScreen('home');
  };

  return (
    <div className="min-h-[85vh] w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center select-none animate-pop-in">
      {/* Celebration Card */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-amber-400 relative overflow-hidden">
        {/* Floating sparkles */}
        <div className="absolute top-4 left-6 text-4xl animate-bounce-slow">✨</div>
        <div className="absolute top-6 right-6 text-4xl animate-float-star">🌟</div>

        {/* Celebration Title */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-black text-base mb-4 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
          <span>YOU ARE AWESOME!</span>
          <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-rose-600 tracking-tight drop-shadow-sm mb-2">
          Hooray, {activeProfile.name}! 🎉
        </h1>

        {/* Stars Award Display */}
        <div className="my-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-100 border-3 border-amber-400 flex items-center justify-center text-4xl md:text-5xl shadow-md animate-bounce-slow"
                style={{ animationDelay: `${starIdx * 0.2}s` }}
              >
                ⭐
              </div>
            ))}
          </div>
          <p className="text-lg md:text-xl font-black text-amber-800">
            +3 Stars Added to Your Trophy Book!
          </p>
          <p className="text-sm font-bold text-gray-500">
            Total Stars: <strong className="text-amber-600">{activeProfile.starsCount} ⭐</strong>
          </p>
        </div>

        {/* Badge Unlocked Card if applicable */}
        {recentBadgeUnlocked ? (
          <div
            onClick={openBadgeModal}
            className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 text-white shadow-xl border-3 border-white cursor-pointer kid-btn-pop active:scale-95"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl animate-wiggle">{recentBadgeUnlocked.emoji}</span>
              <div className="text-left">
                <span className="text-xs uppercase font-black tracking-wider bg-white/30 px-2 py-0.5 rounded-full">
                  New Badge Unlocked!
                </span>
                <h3 className="text-xl md:text-2xl font-black leading-tight">
                  {recentBadgeUnlocked.title}
                </h3>
                <p className="text-xs font-semibold opacity-90">
                  {recentBadgeUnlocked.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <button
              onClick={openBadgeModal}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-bold text-sm hover:bg-amber-100 transition kid-btn-pop"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>View All My Badges ({activeProfile.badgesEarned.length})</span>
            </button>
          </div>
        )}

        {/* Repetition Friendly Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sing Again / Replay */}
          <button
            onClick={handleSingAgain}
            className="py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 border-4 border-amber-600 text-amber-950 font-black text-xl shadow-lg flex items-center justify-center gap-3 kid-btn-pop active:scale-95 transition"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>Sing Again! 🔁</span>
          </button>

          {/* Back to Home Dashboard */}
          <button
            onClick={handleGoHome}
            className="py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 border-4 border-emerald-700 text-white font-black text-xl shadow-lg flex items-center justify-center gap-3 kid-btn-pop active:scale-95 transition"
          >
            <Home className="w-6 h-6 stroke-[3]" />
            <span>Home Dashboard 🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
};
