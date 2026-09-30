import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { numberToWords } from '../../constants/app';
import { X, Play, Square, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NumberExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [isCountingAloud, setIsCountingAloud] = useState(false);
  const [numberFilter, setNumberFilter] = useState<'all' | '10s' | '1-20'>('all');

  const countAloudCurrentRef = useRef(1);
  const countAloudTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsCountingAloud(false);
      setActiveNumber(null);
      if (countAloudTimerRef.current !== null) {
        window.clearInterval(countAloudTimerRef.current);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Number dataset
  const numbers1to100 = Array.from({ length: 100 }, (_, i) => i + 1);
  const bigNumbers = [200, 500, 1000];
  let visibleNumbers = [...numbers1to100, ...bigNumbers];

  if (numberFilter === '10s') {
    visibleNumbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 500, 1000];
  } else if (numberFilter === '1-20') {
    visibleNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
  }

  const handleNumberTap = (num: number) => {
    setActiveNumber(num);
    soundEffects.playNote(300 + (num % 12) * 35, 0.2);
    // Uses full English word (e.g. 67 -> "sixty-seven") to guarantee zero cutoffs
    voiceAssistant.speakNumber(num, () => {
      // Clear highlight on finish
      setActiveNumber((prev) => (prev === num ? null : prev));
    });
  };

  const handleToggleCountAloud = () => {
    if (isCountingAloud) {
      setIsCountingAloud(false);
      voiceAssistant.stop();
      if (countAloudTimerRef.current !== null) {
        window.clearInterval(countAloudTimerRef.current);
      }
    } else {
      setIsCountingAloud(true);
      countAloudCurrentRef.current = 0;
      soundEffects.playPop();

      const countNext = () => {
        if (countAloudCurrentRef.current >= visibleNumbers.length) {
          setIsCountingAloud(false);
          setActiveNumber(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Hooray! You counted all the way!');
          return;
        }

        const currentNum = visibleNumbers[countAloudCurrentRef.current];
        setActiveNumber(currentNum);
        soundEffects.playNote(350 + (currentNum % 10) * 35, 0.2);
        voiceAssistant.speakNumber(currentNum);
        countAloudCurrentRef.current += 1;
      };

      countNext();
      countAloudTimerRef.current = window.setInterval(countNext, 1800);
    }
  };

  const handleResetCount = () => {
    voiceAssistant.stop();
    setIsCountingAloud(false);
    setActiveNumber(null);
    countAloudCurrentRef.current = 0;
    if (countAloudTimerRef.current !== null) {
      window.clearInterval(countAloudTimerRef.current);
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
            <span>💯 1 to 100+ Interactive Number Explorer</span>
            <Sparkles className="w-4 h-4 text-sunshine-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-sunshine-600 leading-tight">
            Tap Any Number to Hear It Spoken Aloud!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Tap numbers to learn full English words (e.g. 67 = "sixty-seven")!
          </p>

          {/* Filter Tabs & Count Aloud Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex bg-amber-100/80 p-1 rounded-2xl border border-amber-300">
              <button
                onClick={() => {
                  setNumberFilter('all');
                  handleResetCount();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition ${
                  numberFilter === 'all'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                All 1 to 100+ 💯
              </button>
              <button
                onClick={() => {
                  setNumberFilter('10s');
                  handleResetCount();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition ${
                  numberFilter === '10s'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                By 10s (10, 20.. 100) 🚀
              </button>
              <button
                onClick={() => {
                  setNumberFilter('1-20');
                  handleResetCount();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition ${
                  numberFilter === '1-20'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                Numbers 1 to 20 ⭐
              </button>
            </div>

            {/* Count Aloud Mode Button */}
            <button
              onClick={handleToggleCountAloud}
              className={`px-4 py-1.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-sm transition kid-btn-pop ${
                isCountingAloud
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isCountingAloud ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pause Counting</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Count Aloud 🎙️</span>
                </>
              )}
            </button>

            {isCountingAloud && (
              <button
                onClick={handleResetCount}
                className="p-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
                title="Reset Count"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Numbers Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3">
          {visibleNumbers.map((num) => {
            const isActive = activeNumber === num;
            const isMilestone = num > 100;
            const isTen = num % 10 === 0 && num <= 100;

            return (
              <button
                key={num}
                onClick={() => handleNumberTap(num)}
                className={`p-2.5 md:p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-white scale-110 shadow-2xl ring-4 ring-amber-300 z-10'
                    : isMilestone
                    ? 'bg-purple-100 hover:bg-purple-200 border-purple-400 text-purple-900 font-black'
                    : isTen
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 font-black'
                    : 'bg-white hover:bg-yellow-50 border-yellow-200 text-gray-800'
                }`}
              >
                <span
                  className={`font-black leading-none ${
                    num >= 100 ? 'text-sm md:text-base' : 'text-lg md:text-2xl'
                  } ${isActive ? 'text-white' : ''}`}
                >
                  {num}
                </span>
                <span
                  className={`text-[9px] font-bold mt-1 leading-none ${
                    isActive ? 'text-amber-100' : 'text-gray-400'
                  }`}
                >
                  {numberToWords(num)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Done Banner */}
        <div className="pt-3 border-t-2 border-sunshine-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-sunshine-500 hover:bg-sunshine-600 text-amber-950 font-black text-base shadow-md kid-btn-pop"
          >
            Done with Numbers 💯
          </button>
        </div>
      </div>
    </div>
  );
};
