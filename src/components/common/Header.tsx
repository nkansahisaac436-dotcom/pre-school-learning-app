import React from 'react';
import { useApp } from '../../context/AppContext';
import { AVATAR_OPTIONS } from '../../data/initialContent';
import { Volume2, VolumeX, Mic, MicOff, Lock, Trophy, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeProfile, 
    openParentGate, 
    settings, 
    toggleSound, 
    toggleVoice, 
    openBadgeModal, 
    screen, 
    navigateHome 
  } = useApp();

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === activeProfile.avatar) || AVATAR_OPTIONS[0];

  // In child learning screens (lesson or activity), show minimal distraction bar
  const isMinimal = screen === 'lesson-player' || screen === 'mini-activity';

  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-3 flex items-center justify-between z-30 select-none">
      {/* Left side: Profile Avatar & Home tap */}
      <div className="flex items-center gap-3">
        {screen !== 'home' && screen !== 'splash' && screen !== 'profile-select' && (
          <button
            onClick={navigateHome}
            aria-label="Home"
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-400 border-3 border-amber-500 shadow-md flex items-center justify-center text-2xl kid-btn-pop active:scale-95 transition"
          >
            🏠
          </button>
        )}

        <button
          onClick={openBadgeModal}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border-2 border-amber-200 shadow-sm hover:border-amber-400 transition kid-btn-pop active:scale-95"
          title="My Stars and Badges"
        >
          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-inner ${currentAvatar.bgColor}`}>
            {currentAvatar.emoji}
          </span>
          <div className="text-left pr-1 hidden sm:block">
            <div className="text-sm font-bold text-gray-800 leading-none">{activeProfile.name}</div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-500 mt-0.5">
              <span>⭐</span>
              <span>{activeProfile.starsCount}</span>
            </div>
          </div>
          <span className="sm:hidden text-xs font-black text-amber-500 flex items-center gap-0.5">
            ⭐ {activeProfile.starsCount}
          </span>
        </button>
      </div>

      {/* Center: Star Trophy quick trigger */}
      {!isMinimal && (
        <div className="flex items-center">
          <button
            onClick={openBadgeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-bold text-sm shadow-md border-2 border-yellow-200 kid-btn-pop"
          >
            <Trophy className="w-4 h-4 text-amber-900 animate-bounce" />
            <span className="hidden md:inline">Badge Book</span>
            <Sparkles className="w-4 h-4 text-yellow-100" />
          </button>
        </div>
      )}

      {/* Right side: Audio controls & Parent Lock */}
      <div className="flex items-center gap-2">
        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          aria-label={settings.soundFxEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition active:scale-95 ${
            settings.soundFxEnabled
              ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
              : 'bg-gray-100 border-gray-300 text-gray-400'
          }`}
          title="Sound Effects"
        >
          {settings.soundFxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Voice Narrator Toggle */}
        <button
          onClick={toggleVoice}
          aria-label={settings.voiceNarrationEnabled ? 'Mute voice narrator' : 'Enable voice narrator'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition active:scale-95 ${
            settings.voiceNarrationEnabled
              ? 'bg-bubblegum-100 border-bubblegum-400 text-bubblegum-600'
              : 'bg-gray-100 border-gray-300 text-gray-400'
          }`}
          title="Voice Guide"
        >
          {settings.voiceNarrationEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Parental Gate Button */}
        <button
          onClick={openParentGate}
          aria-label="Parents & Teachers Area"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white font-medium text-xs shadow hover:bg-slate-900 border-2 border-slate-700 transition active:scale-95"
          title="Parents & Teachers Area (Gated)"
        >
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Parents</span>
        </button>
      </div>
    </header>
  );
};
