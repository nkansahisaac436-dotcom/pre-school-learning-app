import React, { useState, useEffect, useRef } from 'react';
import { ALPHABET_A_TO_Z_ITEMS } from '../../data/initialContent';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AlphabetSoundboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
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

  const handleLetterTap = (item: (typeof ALPHABET_A_TO_Z_ITEMS)[0]) => {
    setActiveLetter(item.letter);
    soundEffects.playSparkleStar();
    voiceAssistant.speakLetter(item.letter, item.word);
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

      const playNextLetter = () => {
        if (autoPlayIndexRef.current >= ALPHABET_A_TO_Z_ITEMS.length) {
          setIsAutoPlaying(false);
          setActiveLetter(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Hooray! You recited all 26 letters from A to Z!');
          return;
        }

        const currentItem = ALPHABET_A_TO_Z_ITEMS[autoPlayIndexRef.current];
        setActiveLetter(currentItem.letter);
        soundEffects.playNote(440 + (autoPlayIndexRef.current % 12) * 40, 0.2);
        voiceAssistant.speakLetter(currentItem.letter, currentItem.word);
        autoPlayIndexRef.current += 1;
      };

      playNextLetter();
      autoPlayTimerRef.current = window.setInterval(playNextLetter, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-bubblegum-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-bubblegum-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-bubblegum-200 hover:bg-bubblegum-300 border-2 border-bubblegum-400 flex items-center justify-center text-bubblegum-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-bubblegum-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bubblegum-100 text-bubblegum-900 font-black text-sm mb-2 border border-bubblegum-300">
            <span>🔤 Interactive A to Z Explorer</span>
            <Sparkles className="w-4 h-4 text-bubblegum-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-bubblegum-600 leading-tight">
            Tap Any Letter from A to Z!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Tap a letter to hear its name & phonics word!
          </p>

          {/* Autoplay A-Z recite bar */}
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
                  <span>Pause Reciting A-Z</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite All 26 Letters A to Z 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* A to Z Grid of 26 Letters */}
        <div className="overflow-y-auto py-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 md:gap-3">
          {ALPHABET_A_TO_Z_ITEMS.map((item) => {
            const isActive = activeLetter === item.letter;

            return (
              <button
                key={item.letter}
                onClick={() => handleLetterTap(item)}
                className={`p-2.5 md:p-3.5 rounded-2xl border-3 flex flex-col items-center justify-center transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white border-white scale-110 shadow-xl ring-4 ring-pink-300 z-10'
                    : 'bg-white hover:bg-pink-50 border-bubblegum-200 text-gray-800'
                }`}
              >
                <span className="text-3xl md:text-4xl font-black drop-shadow-xs leading-none">
                  {item.letter}
                </span>
                <span className="text-xl md:text-2xl mt-1">{item.emoji}</span>
                <span
                  className={`text-[10px] md:text-xs font-bold truncate max-w-full ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {item.word}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 border-t-2 border-bubblegum-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-bubblegum-500 hover:bg-bubblegum-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done Exploring 🌟
          </button>
        </div>
      </div>
    </div>
  );
};
