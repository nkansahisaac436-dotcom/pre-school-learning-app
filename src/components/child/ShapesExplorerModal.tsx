import React, { useState, useEffect, useRef } from 'react';
import { SHAPE_ITEMS } from '../../data/initialContent';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShapesExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeShape, setActiveShape] = useState<string | null>(null);
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

  const handleShapeTap = (item: (typeof SHAPE_ITEMS)[0]) => {
    setActiveShape(item.name);
    soundEffects.playSparkleStar();
    voiceAssistant.speak(`${item.name}! ${item.desc}! Like a ${item.sample}!`);
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

      const playNextShape = () => {
        if (autoPlayIndexRef.current >= SHAPE_ITEMS.length) {
          setIsAutoPlaying(false);
          setActiveShape(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Super job! You explored all the awesome shapes!');
          return;
        }

        const currentItem = SHAPE_ITEMS[autoPlayIndexRef.current];
        setActiveShape(currentItem.name);
        soundEffects.playNote(450 + (autoPlayIndexRef.current % 8) * 45, 0.25);
        voiceAssistant.speak(`${currentItem.name}! ${currentItem.desc}!`);
        autoPlayIndexRef.current += 1;
      };

      playNextShape();
      autoPlayTimerRef.current = window.setInterval(playNextShape, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-grape-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-grape-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-grape-200 hover:bg-grape-300 border-2 border-grape-400 flex items-center justify-center text-grape-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-grape-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-grape-100 text-grape-900 font-black text-sm mb-2 border border-grape-300">
            <span>🔷 Interactive Shape & Pattern Touchboard</span>
            <Sparkles className="w-4 h-4 text-grape-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-grape-600 leading-tight">
            Tap Any Shape to Learn Its Secrets!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Explore 10 shapes, sides, and patterns!
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
                  <span>Pause Shape Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite All Shapes 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shapes Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SHAPE_ITEMS.map((item) => {
            const isActive = activeShape === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleShapeTap(item)}
                className={`p-3.5 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-grape-500 text-white border-white scale-105 shadow-2xl ring-4 ring-grape-300 z-10'
                    : 'bg-white hover:bg-purple-50 border-purple-200 text-gray-800'
                }`}
              >
                <div className="text-4xl md:text-5xl mb-1.5 filter drop-shadow-sm">
                  {item.emoji}
                </div>
                <div className={`font-black text-base md:text-lg leading-tight ${isActive ? 'text-white' : 'text-purple-900'}`}>
                  {item.name}
                </div>
                <div className={`text-[11px] font-semibold mt-1 leading-tight ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                  {item.desc}
                </div>
                <div className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-amber-200' : 'text-purple-600'}`}>
                  {item.sample}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 border-t-2 border-grape-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-grape-500 hover:bg-grape-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done with Shapes 🔷
          </button>
        </div>
      </div>
    </div>
  );
};
