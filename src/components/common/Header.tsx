import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { APP_NAME } from '../../constants/app';
import { Star, Shield, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeProfile, 
    navigateHome, 
    openBadgeModal, 
    openParentGate,
    settings,
    toggleSound,
    toggleVoice 
  } = useApp();

  const handleLogoClick = () => {
    soundEffects.playPop();
    navigateHome();
  };

  const handleStarClick = () => {
    openBadgeModal();
  };

  const handleSettingsClick = () => {
    voiceAssistant.stop();
    soundEffects.playPop();
    openParentGate();
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b-4 border-amber-200 px-3 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-sm select-none">
      {/* App Logo & Mascot Pill */}
      <button
        onClick={handleLogoClick}
        aria-label={`${APP_NAME} Home`}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 transition kid-btn-pop"
      >
        <span className="text-2xl filter drop-shadow-sm animate-wiggle">⭐</span>
        <div className="flex flex-col text-left">
          <span className="font-black text-amber-950 text-base md:text-lg tracking-tight leading-none">
            {APP_NAME}
          </span>
          <span className="text-[10px] font-bold text-amber-800 tracking-wide uppercase">
            Preschool Fun
          </span>
        </div>
      </button>

      {/* Right Controls: Audio Toggles, Stars Won, Parent Lock */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Voice Narration Toggle */}
        <button
          onClick={toggleVoice}
          title={settings.voiceNarrationEnabled ? "Mute Voice" : "Enable Voice"}
          className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition kid-btn-pop ${
            settings.voiceNarrationEnabled
              ? "bg-amber-100 border-amber-400 text-amber-900"
              : "bg-gray-100 border-gray-300 text-gray-400"
          }`}
        >
          {settings.voiceNarrationEnabled ? (
            <Mic className="w-5 h-5 text-amber-700" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={toggleSound}
          title={settings.soundFxEnabled ? "Mute Sounds" : "Enable Sounds"}
          className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition kid-btn-pop ${
            settings.soundFxEnabled
              ? "bg-amber-100 border-amber-400 text-amber-900"
              : "bg-gray-100 border-gray-300 text-gray-400"
          }`}
        >
          {settings.soundFxEnabled ? (
            <Volume2 className="w-5 h-5 text-amber-700" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>

        {/* Stars Collection Pill */}
        <button
          onClick={handleStarClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-2 border-yellow-500 text-amber-950 font-black shadow-sm transition kid-btn-pop"
          title="Your Stars and Badges"
        >
          <Star className="w-5 h-5 fill-amber-950 text-amber-950 animate-spin-slow" />
          <span className="text-base">{activeProfile.starsCount || 0}</span>
        </button>

        {/* Gated Parent Lock Button */}
        <button
          onClick={handleSettingsClick}
          className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 flex items-center justify-center transition kid-btn-pop shadow-sm"
          title="Parent Dashboard (Gated)"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
