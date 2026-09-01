import React, { useState, useEffect, useRef } from 'react';
import { COLOR_ITEMS } from '../../data/initialContent';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorsExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeColor, setActiveColor] = useState<string | null>(null);
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

  const handleColorTap = (item: (typeof COLOR_ITEMS)[0]) => {
    setActiveColor(item.name);
    soundEffects.playSparkleStar();
    voiceAssistant.speak(`${item.name}! Like a ${item.sample}!`);
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

      const playNextColor = () => {
        if (autoPlayIndexRef.current >= COLOR_ITEMS.length) {
          setIsAutoPlaying(false);
          setActiveColor(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Hooray! You explored all the rainbow colors!');
          return;
        }

        const currentItem = COLOR_ITEMS[autoPlayIndexRef.current];
        setActiveColor(currentItem.name);
        soundEffects.playNote(400 + (autoPlayIndexRef.current % 8) * 50, 0.25);
        voiceAssistant.speak(`${currentItem.name}! Like a ${currentItem.sample}!`);
        autoPlayIndexRef.current += 1;
      };

      playNextColor();
      autoPlayTimerRef.current = window.setInterval(playNextColor, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-skycraft-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-skycraft-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-skycraft-200 hover:bg-skycraft-300 border-2 border-skycraft-400 flex items-center justify-center text-skycraft-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-skycraft-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skycraft-100 text-skycraft-900 font-black text-sm mb-2 border border-skycraft-300">
            <span>🎨 Interactive Rainbow Color Palette</span>
            <Sparkles className="w-4 h-4 text-skycraft-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-skycraft-600 leading-tight">
            Tap Any Color to Hear & See It!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Discover 12 vibrant colors with real-life examples!
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
                  <span>Pause Color Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite All 12 Colors 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Colors Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {COLOR_ITEMS.map((item) => {
            const isActive = activeColor === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleColorTap(item)}
                className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center transition duration-150 kid-btn-pop relative ${
                  item.bgClass
                } ${
                  isActive
                    ? 'scale-105 shadow-2xl ring-4 ring-sky-400 z-10 border-sky-500'
                    : 'hover:shadow-md'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-4xl shadow-md mb-2 border-2 border-white"
                  style={{ backgroundColor: item.hex }}
                >
                  <span className="filter drop-shadow">{item.emoji}</span>
                </div>
                <div className={`font-black text-lg md:text-xl leading-tight ${item.textClass}`}>
                  {item.name}
                </div>
                <div className="text-xs font-bold text-gray-600 mt-0.5">
                  {item.sample}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Done Banner */}
        <div className="pt-3 border-t-2 border-skycraft-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-skycraft-500 hover:bg-skycraft-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done with Colors 🌈
          </button>
        </div>
      </div>
    </div>
  );
};
