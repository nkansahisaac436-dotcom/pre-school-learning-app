import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Lesson } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { ArrowLeft, Play, Star, CheckCircle, Music } from 'lucide-react';

export const TopicMenu: React.FC = () => {
  const { selectedTopic, lessons, isLessonCompleted, startLesson, navigateHome } = useApp();

  if (!selectedTopic) {
    return null;
  }

  const topicLessons = lessons.filter((l) => l.topicId === selectedTopic.id);

  const handleLessonTap = (lesson: Lesson) => {
    startLesson(lesson);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center select-none">
      {/* Top Bar with Back Button & Topic Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={navigateHome}
          className="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 border-3 border-amber-600 text-amber-950 flex items-center justify-center kid-btn-pop shadow-md text-xl"
          title="Back to Topics"
        >
          <ArrowLeft className="w-7 h-7 stroke-[3]" />
        </button>

        {/* Topic Title Badge */}
        <div
          className={`flex items-center gap-3 px-6 py-2.5 rounded-3xl border-4 ${selectedTopic.colorTheme.border} ${selectedTopic.colorTheme.bg} shadow-md`}
        >
          <span className="text-4xl">{selectedTopic.iconEmoji}</span>
          <div className="text-left">
            <h1 className={`text-2xl md:text-3xl font-black ${selectedTopic.colorTheme.text}`}>
              {selectedTopic.name}
            </h1>
            <p className="text-xs font-bold text-gray-500">Pick a song or video!</p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playPop();
            voiceAssistant.speak(`Pick a song to sing in ${selectedTopic.name}!`);
          }}
          className="w-14 h-14 rounded-2xl bg-white hover:bg-amber-100 border-3 border-amber-300 text-amber-900 flex items-center justify-center kid-btn-pop shadow-md text-2xl"
          title="Voice Guide"
        >
          🔊
        </button>
      </div>

      {/* Lesson Cards List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {topicLessons.map((lesson) => {
          const completed = isLessonCompleted(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => handleLessonTap(lesson)}
              className="w-full bg-white rounded-3xl p-5 md:p-6 border-4 border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-xl flex items-center gap-4 text-left transition kid-card active:scale-95 group relative overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-5xl md:text-6xl shadow-inner relative group-hover:scale-105 transition"
                style={{ backgroundColor: `${lesson.accentColor}20` }}
              >
                <span>{lesson.thumbnailEmoji}</span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* Lesson Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>Song • {lesson.durationSeconds}s</span>
                  </span>
                  {completed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Done</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight group-hover:text-amber-600 transition">
                  {lesson.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-1 line-clamp-2">
                  {lesson.description}
                </p>
              </div>

              {/* Action Circle */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition border-2 border-emerald-600">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Star Badge if done */}
              {completed && (
                <div className="absolute top-2 right-2 text-amber-400 text-lg">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
