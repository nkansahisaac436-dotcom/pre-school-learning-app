import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { ActivityOption } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export const MiniActivity: React.FC = () => {
  const { selectedLesson, completeCurrentLesson, finishActivityToReward, setScreen } = useApp();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [shakingOptionId, setShakingOptionId] = useState<string | null>(null);
  const [isCorrectHandled, setIsCorrectHandled] = useState(false);

  const activity = selectedLesson?.activity;

  // Speak the question upon entering
  useEffect(() => {
    if (activity) {
      const textToSpeak = activity.audioPromptText || activity.questionPrompt;
      voiceAssistant.speak(textToSpeak);
    }
  }, [activity]);

  if (!selectedLesson || !activity) {
    return null;
  }

  const handleSpeakQuestion = () => {
    soundEffects.playPop();
    const textToSpeak = activity.audioPromptText || activity.questionPrompt;
    voiceAssistant.speak(textToSpeak);
  };

  const handleOptionTap = (option: ActivityOption) => {
    if (isCorrectHandled) return;

    if (option.isCorrect) {
      setSelectedOptionId(option.id);
      setIsCorrectHandled(true);
      soundEffects.playSparkleStar();

      // Trigger colorful confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#a855f7'],
        });
      } catch {
        // Safe ignore
      }

      // Voice praise
      const cheerText = activity.feedbackSuccessText || 'Hooray! That is correct! You are a superstar!';
      voiceAssistant.speakCheer(cheerText);

      // Record lesson completion & award stars
      completeCurrentLesson();

      // Transition to Reward screen after brief moment
      setTimeout(() => {
        finishActivityToReward();
      }, 1800);
    } else {
      // Gentle encouragement (no harsh buzzer!)
      soundEffects.playGentleBoing();
      setShakingOptionId(option.id);
      voiceAssistant.speakEncouragement();

      setTimeout(() => {
        setShakingOptionId(null);
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center select-none">
      {/* Top Bar with Back to Lesson & Listen Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setScreen('lesson-player')}
          className="px-4 py-2 bg-white/90 border-2 border-amber-300 rounded-2xl font-black text-sm text-gray-700 kid-btn-pop flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Song</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-black text-sm">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <span>Mini Game Time!</span>
        </div>

        <button
          onClick={handleSpeakQuestion}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 text-amber-950 rounded-2xl font-black text-sm flex items-center gap-1.5 kid-btn-pop shadow"
          title="Repeat Question"
        >
          <Volume2 className="w-4 h-4" />
          <span>Hear Question</span>
        </button>
      </div>

      {/* Question Card Banner */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-300 text-center mb-6 relative">
        <button
          onClick={handleSpeakQuestion}
          className="absolute -top-4 right-4 w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-600 text-amber-950 flex items-center justify-center text-xl shadow-md kid-btn-pop"
          title="Speak Question"
        >
          🔊
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-amber-600 block mb-1">
          Tap the right answer!
        </span>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
          {activity.questionPrompt}
        </h2>
      </div>

      {/* 2-3 Big Tap-to-Answer Option Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {activity.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isShaking = shakingOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionTap(option)}
              disabled={isCorrectHandled}
              className={`p-6 md:p-8 rounded-3xl border-4 flex flex-col items-center justify-center text-center transition duration-200 kid-card min-h-[190px] md:min-h-[240px] relative overflow-hidden active:scale-95 ${
                option.color || 'bg-white border-amber-200'
              } ${isSelected ? 'ring-8 ring-emerald-400 border-emerald-500 scale-105 shadow-2xl bg-emerald-50' : ''} ${
                isShaking ? 'animate-wiggle border-rose-300' : ''
              }`}
            >
              {/* Option Visual / Emoji */}
              <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-md transform transition-transform group-hover:scale-110">
                {option.imageEmoji || '✨'}
              </div>

              {/* Large Label (for voice & reading assistance) */}
              <div className="text-xl md:text-2xl font-black text-gray-800 leading-tight drop-shadow-sm">
                {option.label}
              </div>

              {/* Success Badge checkmark */}
              {isSelected && (
                <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center animate-pop-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
