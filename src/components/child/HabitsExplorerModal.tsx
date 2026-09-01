import React, { useState, useEffect, useRef } from 'react';
import { HABIT_ITEMS } from '../../data/initialContent';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HabitsExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [checkedHabits, setCheckedHabits] = useState<string[]>([]);
  const [activeHabit, setActiveHabit] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIndexRef = useRef(0);
  const autoPlayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAutoPlaying(false);
      if (autoPlayTimerRef.current !== null) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleHabitTap = (item: (typeof HABIT_ITEMS)[0]) => {
    setActiveHabit(item.name);
    soundEffects.playSparkleStar();
    setCheckedHabits((prev) =>
      prev.includes(item.name) ? prev : [...prev, item.name]
    );
    voiceAssistant.speak(`${item.name}! ${item.phrase}!`);
  };

  const handleToggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      voiceAssistant.stop();
      if (autoPlayTimerRef.current !== null) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    } else {
      setIsAutoPlaying(true);
      autoPlayIndexRef.current = 0;
      soundEffects.playPop();

      const playNextHabit = () => {
        if (autoPlayIndexRef.current >= HABIT_ITEMS.length) {
          setIsAutoPlaying(false);
          setActiveHabit(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('You are a Super Clean & Healthy Hero! High five!');
          return;
        }

        const currentItem = HABIT_ITEMS[autoPlayIndexRef.current];
        setActiveHabit(currentItem.name);
        setCheckedHabits((prev) =>
          prev.includes(currentItem.name) ? prev : [...prev, currentItem.name]
        );
        soundEffects.playNote(480 + (autoPlayIndexRef.current % 6) * 60, 0.25);
        voiceAssistant.speak(`${currentItem.name}! ${currentItem.phrase}!`);
        autoPlayIndexRef.current += 1;
      };

      playNextHabit();
      autoPlayTimerRef.current = window.setInterval(playNextHabit, 2400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-coral-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-coral-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-coral-200 hover:bg-coral-300 border-2 border-coral-400 flex items-center justify-center text-coral-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-coral-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-100 text-coral-900 font-black text-sm mb-2 border border-coral-300">
            <span>🧼 Healthy Hero & Daily Habits Routine</span>
            <Sparkles className="w-4 h-4 text-coral-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-coral-600 leading-tight">
            Tap Habits to Become a Super Clean Hero!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Tap daily habits to practice kindness, hygiene, and strong health!
          </p>

          <div className="mt-3 flex justify-center">
            <button
              onClick={handleToggleAutoPlay}
              className={`px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition kid-btn-pop ${
                isAutoPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pause Habits Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite All 10 Habits 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Habits Checklist Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HABIT_ITEMS.map((item) => {
            const isChecked = checkedHabits.includes(item.name);
            const isActive = activeHabit === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleHabitTap(item)}
                className={`p-3.5 rounded-3xl border-3 flex items-center gap-3.5 text-left transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-coral-500 text-white border-white scale-102 shadow-xl ring-4 ring-coral-300 z-10'
                    : isChecked
                    ? 'bg-coral-50 border-coral-300 text-coral-950'
                    : 'bg-white hover:bg-orange-50 border-orange-200 text-gray-800'
                }`}
              >
                <div className="text-4xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base leading-tight">
                    {item.name}
                  </div>
                  <div className={`text-xs mt-0.5 font-medium leading-snug ${isActive ? 'text-coral-100' : 'text-gray-500'}`}>
                    {item.phrase}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isChecked ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                      <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                      ⭐
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 border-t-2 border-coral-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done with Habits 🧼
          </button>
        </div>
      </div>
    </div>
  );
};
