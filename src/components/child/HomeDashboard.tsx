import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Topic } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Sparkles, Star, Heart } from 'lucide-react';

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

  const handleSparkyTap = () => {
    setIsSparkyWinking(true);
    soundEffects.playSparkleStar();
    voiceAssistant.speak(`Hi ${activeProfile.name}! Sparky loves you! Let us sing a fun song!`);
    setTimeout(() => {
      setIsSparkyWinking(false);
    }, 1800);
  };

  const handleTopicTap = (topic: Topic) => {
    selectTopicAndNavigate(topic);
  };

  const handleTopicHover = () => {
    soundEffects.playPop();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center select-none">
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
            />
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
            onClick={openAlphabetModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🔤</span>
            <span className="font-black text-xs mt-1 leading-tight">A to Z Board</span>
            <span className="text-[10px] text-pink-100 font-bold">26 Letters</span>
          </button>

          {/* 1 to 100+ Numbers Button */}
          <button
            onClick={openNumberModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">💯</span>
            <span className="font-black text-xs mt-1 leading-tight text-amber-950">1-100+ Grid</span>
            <span className="text-[10px] text-amber-900 font-bold">Count Aloud</span>
          </button>

          {/* Colors Button */}
          <button
            onClick={openColorsModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🎨</span>
            <span className="font-black text-xs mt-1 leading-tight">Rainbow Colors</span>
            <span className="text-[10px] text-sky-100 font-bold">12 Colors</span>
          </button>

          {/* Shapes Button */}
          <button
            onClick={openShapesModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-400 to-grape-500 text-white border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🔷</span>
            <span className="font-black text-xs mt-1 leading-tight">Shape Board</span>
            <span className="text-[10px] text-purple-100 font-bold">10 Shapes</span>
          </button>

          {/* Animals Button */}
          <button
            onClick={openAnimalsModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-white border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🦁</span>
            <span className="font-black text-xs mt-1 leading-tight">Safari Sounds</span>
            <span className="text-[10px] text-emerald-100 font-bold">20 Animals</span>
          </button>

          {/* Habits Button */}
          <button
            onClick={openHabitsModal}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-400 to-coral-500 text-white border-3 border-white shadow-md flex flex-col items-center justify-center text-center transition kid-btn-pop active:scale-95 group min-h-[90px]"
          >
            <span className="text-3xl group-hover:scale-110 transition">🧼</span>
            <span className="font-black text-xs mt-1 leading-tight">Healthy Hero</span>
            <span className="text-[10px] text-orange-100 font-bold">10 Habits</span>
          </button>
        </div>
      </div>

      {/* Grid of Big Colorful Topic Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {topics.map((topic) => {
          const topicLessons = lessons.filter((l) => l.topicId === topic.id);
          const completedCount = topicLessons.filter((l) =>
            activeProfile.completedLessons.includes(l.id)
          ).length;
          const hasBadge = activeProfile.badgesEarned.includes(topic.badgeId);

          return (
            <button
              key={topic.id}
              onClick={() => handleTopicTap(topic)}
              onMouseEnter={handleTopicHover}
              aria-label={`Explore ${topic.name}`}
              className={`group relative rounded-3xl p-5 md:p-6 border-4 ${topic.colorTheme.border} ${topic.colorTheme.bg} transition duration-200 kid-card flex flex-col items-center justify-between text-center overflow-hidden min-h-[190px] md:min-h-[210px] active:scale-95`}
            >
              {/* Subtle gradient background hover glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${topic.colorTheme.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Status Header */}
              <div className="w-full flex items-center justify-between z-10">
                {hasBadge ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm border border-yellow-200">
                    <Star className="w-3.5 h-3.5 fill-amber-950" />
                    <span>Mastered!</span>
                  </span>
                ) : (
                  <span className="text-xs font-black text-gray-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-gray-200">
                    {completedCount}/{topicLessons.length} Done
                  </span>
                )}

                {/* Speaker icon hint */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    voiceAssistant.speak(topic.voiceName || topic.name);
                    soundEffects.playPop();
                  }}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-sm text-gray-700 active:scale-90 transition"
                  title="Listen"
                >
                  🔊
                </span>
              </div>

              {/* Big Icon */}
              <div className="my-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 z-10">
                <span className="text-5xl md:text-6xl filter drop-shadow-md inline-block">
                  {topic.iconEmoji}
                </span>
              </div>

              {/* Topic Name */}
              <div className="z-10 w-full">
                <div
                  className={`text-lg md:text-xl font-black ${topic.colorTheme.text} leading-tight drop-shadow-sm tracking-wide`}
                >
                  {topic.name}
                </div>
                <div className="text-[11px] font-bold text-gray-500 mt-0.5">
                  {topicLessons.length} Songs & Activities
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
