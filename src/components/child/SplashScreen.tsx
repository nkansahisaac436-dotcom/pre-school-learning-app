import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Play, Sparkles, Star, Heart } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setScreen, activeProfile } = useApp();

  const handleStart = () => {
    soundEffects.playRewardFanfare();
    voiceAssistant.speak(`Welcome ${activeProfile.name}! Let's sing and learn together!`);
    setScreen('home');
  };

  const handleSwitchProfile = () => {
    soundEffects.playPop();
    setScreen('profile-select');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-200 via-rose-100 to-sky-200 relative overflow-hidden select-none">
      {/* Floating decorative kid shapes */}
      <div className="absolute top-10 left-8 text-5xl animate-bounce-slow opacity-80">🌈</div>
      <div className="absolute top-20 right-10 text-5xl animate-float-star opacity-80">⭐</div>
      <div className="absolute bottom-24 left-10 text-5xl animate-bounce-slow opacity-80">🎈</div>
      <div className="absolute bottom-20 right-12 text-5xl animate-wiggle opacity-80">🦁</div>

      {/* Top Banner */}
      <div className="w-full flex justify-end pt-2">
        <button
          onClick={handleSwitchProfile}
          className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl border-2 border-amber-300 shadow-sm text-sm font-bold text-gray-700 flex items-center gap-2 kid-btn-pop"
        >
          <span>👤</span>
          <span>Switch Child</span>
        </button>
      </div>

      {/* Center Branding & Mascot */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-lg">
        {/* Mascot Avatar Bubble */}
        <div className="relative mb-6">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 p-2 shadow-2xl border-4 border-white flex items-center justify-center animate-bounce-slow">
            <span className="text-7xl md:text-8xl filter drop-shadow-md">🦁</span>
          </div>
          <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-2.5 rounded-full border-2 border-white shadow-lg animate-wiggle">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -left-1 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-black border-2 border-white shadow">
            Ages 2-5
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-rose-600 tracking-tight drop-shadow-md flex flex-wrap items-center justify-center gap-2">
          <span>IKJ</span>
          <span className="text-amber-500">Fun</span>
          <span className="text-sky-500">Academy</span>
        </h1>

        <p className="text-lg md:text-xl font-bold text-amber-900 mt-3 flex items-center justify-center gap-2">
          <span>🎵 Sing Songs</span>
          <span>•</span>
          <span>📺 Watch & Learn</span>
          <span>•</span>
          <span>⭐ Win Badges</span>
        </p>

        {/* Child greeting */}
        <div className="mt-4 px-5 py-2 rounded-full bg-white/80 border-2 border-amber-300 text-amber-900 font-bold text-sm shadow-sm flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Ready to play, <strong className="text-rose-600">{activeProfile.name}</strong>?</span>
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStart}
          className="mt-8 px-10 py-5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white text-2xl md:text-3xl font-black rounded-3xl border-4 border-emerald-600 shadow-2xl flex items-center gap-4 kid-btn-pop active:scale-95 group transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition">
            <Play className="w-7 h-7 fill-emerald-600 translate-x-0.5" />
          </div>
          <span>LET'S PLAY!</span>
          <Star className="w-7 h-7 text-yellow-300 fill-yellow-300 animate-spin" />
        </button>
      </div>

      {/* Bottom Footer Safeguard */}
      <div className="w-full text-center text-xs font-semibold text-amber-800/80 pb-2 z-10 flex items-center justify-center gap-3">
        <span>🛡️ 100% Child-Safe</span>
        <span>•</span>
        <span>🚫 No Ads</span>
        <span>•</span>
        <span>🎙️ Voice-Guided</span>
      </div>
    </div>
  );
};
