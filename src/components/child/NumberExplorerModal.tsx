import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type NumberTab = 'tens' | 'first20' | 'all100';

export const NumberExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<NumberTab>('all100');
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
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

  // Build numbers arrays
  const numbers1To100 = Array.from({ length: 100 }, (_, i) => i + 1);
  const numbersFirst20 = Array.from({ length: 20 }, (_, i) => i + 1);
  const numbersTensAndAbove = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 500, 1000];

  const currentNumbers =
    activeTab === 'first20'
      ? numbersFirst20
      : activeTab === 'tens'
      ? numbersTensAndAbove
      : numbers1To100;

  const handleNumberTap = (num: number) => {
    setActiveNumber(num);
    const baseFreq = 260 + ((num % 20) / 20) * 440;
    soundEffects.playNote(baseFreq, 0.2);
    voiceAssistant.speakNumber(num);
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

      const playNextNumber = () => {
        if (autoPlayIndexRef.current >= currentNumbers.length) {
          setIsAutoPlaying(false);
          setActiveNumber(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Hooray! You recited all the numbers all the way to one hundred and beyond!');
          return;
        }

        const currentNum = currentNumbers[autoPlayIndexRef.current];
        setActiveNumber(currentNum);
        const baseFreq = 260 + ((currentNum % 20) / 20) * 440;
        soundEffects.playNote(baseFreq, 0.18);
        voiceAssistant.speakNumber(currentNum);
        autoPlayIndexRef.current += 1;
      };

      playNextNumber();
      // Faster count for 100 numbers, slightly paced for tens
      const intervalMs = activeTab === 'all100' ? 1000 : 1200;
      autoPlayTimerRef.current = window.setInterval(playNextNumber, intervalMs);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-sunshine-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-sunshine-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-sunshine-200 hover:bg-sunshine-300 border-2 border-sunshine-400 flex items-center justify-center text-sunshine-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-sunshine-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunshine-100 text-sunshine-900 font-black text-sm mb-2 border border-sunshine-300">
            <span>💯 Interactive 1 to 100+ Number Explorer</span>
            <Sparkles className="w-4 h-4 text-sunshine-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-sunshine-600 leading-tight">
            Tap Any Number to Hear It Count Aloud!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Tap numbers from 1 to 100 and above (100, 200, 500, 1000)!
          </p>

          {/* Tab Navigation & Autoplay */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="flex bg-sunshine-100 p-1 rounded-2xl border border-sunshine-300">
              <button
                onClick={() => {
                  setActiveTab('all100');
                  soundEffects.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'all100' ? 'bg-amber-500 text-white shadow' : 'text-amber-900 hover:bg-sunshine-200'
                }`}
              >
                All 1 to 100 💯
              </button>
              <button
                onClick={() => {
                  setActiveTab('tens');
                  soundEffects.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'tens' ? 'bg-amber-500 text-white shadow' : 'text-amber-900 hover:bg-sunshine-200'
                }`}
              >
                Count by 10s & 100+ 🚀
              </button>
              <button
                onClick={() => {
                  setActiveTab('first20');
                  soundEffects.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'first20' ? 'bg-amber-500 text-white shadow' : 'text-amber-900 hover:bg-sunshine-200'
                }`}
              >
                Numbers 1 to 20 ⭐
              </button>
            </div>

            <button
              onClick={handleToggleAutoPlay}
              className={`px-4 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md transition kid-btn-pop ${
                isAutoPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pause Reciting</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite Count Aloud 🎙️</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Number Grid */}
        <div
          className={`overflow-y-auto py-4 grid gap-2 md:gap-2.5 ${
            activeTab === 'tens'
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
              : 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10'
          }`}
        >
          {currentNumbers.map((num) => {
            const isActive = activeNumber === num;
            const isMilestone = num % 10 === 0 || num >= 100;

            return (
              <button
                key={num}
                onClick={() => handleNumberTap(num)}
                className={`p-2 sm:p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-white scale-110 shadow-xl ring-4 ring-amber-300 z-10'
                    : isMilestone
                    ? 'bg-sunshine-100 hover:bg-sunshine-200 border-sunshine-400 text-amber-950 font-black'
                    : 'bg-white hover:bg-amber-50 border-amber-200 text-gray-800'
                }`}
              >
                <span
                  className={`font-black leading-none drop-shadow-xs ${
                    num >= 100 ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                  }`}
                >
                  {num}
                </span>

                {isMilestone && (
                  <span className="text-[10px] text-amber-600 mt-0.5">
                    {num === 100 ? '💯' : num >= 200 ? '🚀' : '⭐'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 border-t-2 border-sunshine-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done Counting 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
