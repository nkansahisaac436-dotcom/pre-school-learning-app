import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { APP_NAME, APP_TAGLINE, MASCOT_NAME } from '../../constants/app';
import { Sparkles, Play } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useApp();

  const handleStart = () => {
    soundEffects.playRewardFanfare();
    voiceAssistant.speak(`Welcome to ${APP_NAME}! I am ${MASCOT_NAME}! Let us sing and learn together!`);
    setScreen('home');
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center relative overflow-hidden animate-pop-in">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/50 via-white to-orange-50/50 pointer-events-none" />

        {/* Mascot Sparky Avatar */}
        <div className="relative mb-4 z-10">
          <img
            src="/sparky.png"
            alt={MASCOT_NAME}
            className="w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-xl animate-bounce-slow"
          />
          <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">✨</div>
        </div>

        {/* Title */}
        <div className="z-10 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs md:text-sm mb-2 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Fun Preschool Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-amber-950 tracking-tight leading-none drop-shadow-sm">
            {APP_NAME}
          </h1>
          <p className="text-base md:text-lg font-bold text-amber-800 mt-2">
            {APP_TAGLINE}
          </p>
        </div>

        {/* Topics preview emojis */}
        <div className="flex items-center justify-center gap-3 text-3xl mb-6 z-10 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200">
          <span>🔤</span>
          <span>💯</span>
          <span>🎨</span>
          <span>🔷</span>
          <span>🦁</span>
          <span>🧼</span>
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 md:py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black text-xl md:text-2xl shadow-xl border-3 border-emerald-600 flex items-center justify-center gap-3 transition active:scale-95 kid-btn-pop z-10"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>TAP TO PLAY! 🚀</span>
        </button>
      </div>
    </div>
  );
};
