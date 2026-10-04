import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Topic } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { musicEngine } from '../../services/musicEngine';
import { Sparkles, Star, Heart, Flame, Moon, Award } from 'lucide-react';
import { StickerBookModal } from './StickerBookModal';
import { BedtimeModeModal } from './BedtimeModeModal';

export const HomeDashboard: React.FC = () => {
  const { 
    topics, 
    lessons, 
    selectTopicAndNavigate, 
    activeProfile, 
    openAlphabetModal, 
    openNumberModal,
    openColorsModal,
    openShapesModal,
    openAnimalsModal,
    openHabitsModal 
  } = useApp();

  const [isSparkyWinking, setIsSparkyWinking] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isBedtimeOpen, setIsBedtimeOpen] = useState(false);

  const handleSparkyTap = () => {
    setIsSparkyWinking(true);
    musicEngine.playStarChime();
    voiceAssistant.speak(`Hi ${activeProfile.name}! Sparky loves you! Let us sing a cheerful song together!`);
    setTimeout(() => {
      setIsSparkyWinking(false);
    }, 1800);
  };

  const handleTopicTap = (topic: Topic) => {
    musicEngine.playPop();
    selectTopicAndNavigate(topic);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center select-none">
      {/* Top Banner with Streak, Stickers & Bedtime mode */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4">
        {/* Daily Streak Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border-2 border-amber-300 text-amber-950 font-black text-xs md:text-sm shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span>{activeProfile.streakDays || 3} Day Streak! 🔥</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sticker Book Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              setIsStickerBookOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-yellow-300 hover:bg-yellow-400 text-yellow-950 font-black text-xs md:text-sm border-2 border-yellow-400 shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <Award className="w-4 h-4 text-yellow-800" />
            <span>Sticker Album ⭐</span>
          </button>

          {/* Bedtime Mode Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              setIsBedtimeOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-indigo-900 hover:bg-indigo-800 text-indigo-100 font-black text-xs md:text-sm border-2 border-indigo-700 shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <Moon className="w-4 h-4 text-yellow-300" />
            <span>Bedtime Lullabies 🌙</span>
          </button>
        </div>
      </div>

      {/* Friendly Mascot Greeting Banner */}
      <div className="w-full flex flex-col items-center text-center mb-6">
        {/* Sparky Interactive Mascot */}
        <button
          onClick={handleSparkyTap}
          className="relative group cursor-pointer active:scale-95 transition-transform duration-200 mb-2 focus:outline-none"
          title="Tap Sparky to hear him speak!"
        >
          <div className="relative">
            <img
              src="/sparky.png"
              alt="Sparky"
              className={`w-24 h-24 md:w-28 md:h-28 object-contain filter drop-shadow-md transition-transform duration-300 ${
                isSparkyWinking ? 'scale-110 rotate-6' : 'group-hover:scale-105 animate-bounce-slow'
              }`}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-6xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">⭐</span>
            {isSparkyWinking && (
              <div className="absolute -top-1 -right-1 text-2xl animate-spin">✨</div>
            )}
          </div>
          <span className="text-[11px] font-black text-amber-800 bg-amber-200/90 px-3 py-0.5 rounded-full border border-amber-300 shadow-sm block mt-1">
            Tap Sparky! ⭐
          </span>
        </button>

        {/* Greeting Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 border-2 border-amber-300 shadow-sm text-amber-900 font-black text-sm md:text-base mb-2">
          <span>Hello, {activeProfile.name}! 👋</span>
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-amber-950 tracking-tight flex items-center justify-center gap-2 leading-snug">
          <span>What should we learn today?</span>
          <span>🎶</span>
        </h2>
        <p className="text-xs md:text-sm font-bold text-amber-800 mt-1">
          Tap any topic below to sing songs, or try the interactive touchboards!
        </p>
      </div>

      {/* Interactive Touchboards Grid */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
            Interactive Touchboards & Soundboards
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {/* A to Z Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openAlphabetModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 text-white border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🔤</span>
            <span className="font-black text-xs mt-1 leading-tight">A to Z Board</span>
            <span className="text-[10px] text-pink-100 font-bold">26 Letters</span>
          </button>

          {/* 1 to 100+ Numbers Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openNumberModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">💯</span>
            <span className="font-black text-xs mt-1 leading-tight text-amber-950">1-100+ Grid</span>
            <span className="text-[10px] text-amber-900 font-bold">Count Aloud</span>
          </button>

          {/* Colors Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openColorsModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 text-white border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🎨</span>
            <span className="font-black text-xs mt-1 leading-tight">Rainbow Colors</span>
            <span className="text-[10px] text-sky-100 font-bold">12 Colors</span>
          </button>

          {/* Shapes Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openShapesModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🔷</span>
            <span className="font-black text-xs mt-1 leading-tight">Shape Board</span>
            <span className="text-[10px] text-purple-100 font-bold">10 Shapes</span>
          </button>

          {/* Animals Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openAnimalsModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 text-white border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🦁</span>
            <span className="font-black text-xs mt-1 leading-tight">Safari Sounds</span>
            <span className="text-[10px] text-emerald-100 font-bold">20 Animals</span>
          </button>

          {/* Good Habits Button */}
          <button
            onClick={() => {
              musicEngine.playPop();
              openHabitsModal();
            }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white border-4 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[92px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🧼</span>
            <span className="font-black text-xs mt-1 leading-tight">Good Habits</span>
            <span className="text-[10px] text-teal-100 font-bold">Checklist</span>
          </button>
        </div>
      </div>

      {/* Main Learning Topics List */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
            Singing & Musical Learning Topics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => {
            const topicLessons = lessons.filter((l) => l.topicId === topic.id);
            const completedCount = topicLessons.filter((l) =>
              activeProfile.completedLessons.includes(l.id)
            ).length;

            return (
              <button
                key={topic.id}
                onClick={() => handleTopicTap(topic)}
                className="w-full text-left bg-white/95 rounded-3xl p-5 border-4 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-lg transition transform active:scale-98 flex flex-col justify-between group min-h-[140px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                    {topic.iconEmoji}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                    {completedCount}/{topicLessons.length} Done ⭐
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-amber-800 transition">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-gray-600 font-bold mt-0.5">
                    {topicLessons.length} Upbeat Songs & Activities
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <StickerBookModal
        isOpen={isStickerBookOpen}
        onClose={() => setIsStickerBookOpen(false)}
        unlockedStickerIds={activeProfile.stickersEarned || ['stk_sparky_gold']}
      />

      <BedtimeModeModal
        isOpen={isBedtimeOpen}
        onClose={() => setIsBedtimeOpen(false)}
      />
    </div>
  );
};
