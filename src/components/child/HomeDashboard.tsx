import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Topic } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Sparkles, Star } from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    topics, 
    lessons, 
    selectTopicAndNavigate, 
    activeProfile, 
    openAlphabetModal, 
    openNumberModal 
  } = useApp();

  const handleTopicTap = (topic: Topic) => {
    selectTopicAndNavigate(topic);
  };

  const handleTopicHover = () => {
    soundEffects.playPop();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center select-none">
      {/* Friendly Visual Banner */}
      <div className="w-full text-center mb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-amber-300 shadow-sm text-amber-900 font-black text-sm md:text-base mb-2">
          <span>👋 Hello, {activeProfile.name}!</span>
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-amber-950 tracking-tight flex items-center justify-center gap-2">
          <span>What should we sing today?</span>
          <span>🎶</span>
        </h2>
      </div>

      {/* Interactive Quick Launchers for A-to-Z and 1-to-100+ */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* A to Z Touchboard Button */}
        <button
          onClick={openAlphabetModal}
          className="p-4 rounded-3xl bg-gradient-to-r from-pink-400 via-rose-400 to-bubblegum-500 text-white border-4 border-white shadow-lg flex items-center justify-between transition kid-btn-pop active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition">
              🔤
            </div>
            <div className="text-left">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/30 px-2 py-0.5 rounded-full">
                Interactive Touchboard
              </span>
              <h3 className="text-xl md:text-2xl font-black leading-tight drop-shadow-sm">
                A to Z Alphabet Explorer
              </h3>
              <p className="text-xs font-semibold text-pink-100">
                Tap all 26 letters & phonics sounds!
              </p>
            </div>
          </div>
          <span className="text-2xl">✨</span>
        </button>

        {/* 1 to 100+ Numbers Grid Button */}
        <button
          onClick={openNumberModal}
          className="p-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-amber-950 border-4 border-white shadow-lg flex items-center justify-between transition kid-btn-pop active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition">
              💯
            </div>
            <div className="text-left">
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-950/20 text-amber-950 px-2 py-0.5 rounded-full">
                1 to 100 & Above
              </span>
              <h3 className="text-xl md:text-2xl font-black leading-tight drop-shadow-sm text-amber-950">
                1 to 100+ Number Explorer
              </h3>
              <p className="text-xs font-bold text-amber-900">
                Count 1 to 100, 200, 500 & 1000!
              </p>
            </div>
          </div>
          <span className="text-2xl">🚀</span>
        </button>
      </div>

      {/* Grid of Big Colorful Topic Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl">
        {topics.map((topic) => {
          // Calculate topic lessons completed
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
              className={`group relative rounded-3xl p-5 md:p-7 border-4 ${topic.colorTheme.border} ${topic.colorTheme.bg} transition duration-200 kid-card flex flex-col items-center justify-between text-center overflow-hidden aspect-square sm:aspect-auto sm:min-h-[220px] active:scale-95`}
            >
              {/* Subtle background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${topic.colorTheme.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Top status indicator: Star completion */}
              <div className="w-full flex items-center justify-between z-10">
                {hasBadge ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm border border-yellow-200">
                    <Star className="w-3.5 h-3.5 fill-amber-950" />
                    <span>Won!</span>
                  </span>
                ) : (
                  <span className="text-xs font-black text-gray-500 bg-white/80 px-2 py-0.5 rounded-full border">
                    {completedCount}/{topicLessons.length}
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

              {/* Big Icon / Emoji */}
              <div className="my-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 z-10">
                <span className="text-6xl md:text-7xl filter drop-shadow-md inline-block">
                  {topic.iconEmoji}
                </span>
              </div>

              {/* Big Friendly Topic Name */}
              <div className="z-10 w-full">
                <div
                  className={`text-xl md:text-2xl font-black ${topic.colorTheme.text} leading-tight drop-shadow-sm tracking-wide`}
                >
                  {topic.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
