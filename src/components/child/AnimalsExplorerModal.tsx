import React, { useState, useEffect, useRef } from 'react';
import { ANIMAL_ITEMS } from '../../data/initialContent';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { X, Play, Square, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimalsExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);
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

  const handleAnimalTap = (item: (typeof ANIMAL_ITEMS)[0]) => {
    setActiveAnimal(item.name);
    soundEffects.playSparkleStar();
    voiceAssistant.speak(`${item.name}! Says ${item.sound}! Found in the ${item.habitat}!`);
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

      const playNextAnimal = () => {
        if (autoPlayIndexRef.current >= ANIMAL_ITEMS.length) {
          setIsAutoPlaying(false);
          setActiveAnimal(null);
          soundEffects.playRewardFanfare();
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          voiceAssistant.speak('Hooray! You met all the wonderful animal friends!');
          return;
        }

        const currentItem = ANIMAL_ITEMS[autoPlayIndexRef.current];
        setActiveAnimal(currentItem.name);
        soundEffects.playNote(380 + (autoPlayIndexRef.current % 10) * 35, 0.25);
        voiceAssistant.speak(`${currentItem.name}! Says ${currentItem.sound}!`);
        autoPlayIndexRef.current += 1;
      };

      playNextAnimal();
      autoPlayTimerRef.current = window.setInterval(playNextAnimal, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-gradient-to-b from-meadow-50 to-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-meadow-400 relative text-gray-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceAssistant.stop();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-meadow-200 hover:bg-meadow-300 border-2 border-meadow-400 flex items-center justify-center text-meadow-900 text-xl font-bold kid-btn-pop"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b-2 border-meadow-200">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-meadow-100 text-meadow-900 font-black text-sm mb-2 border border-meadow-300">
            <span>🦁 Interactive Safari & Animal Soundboard</span>
            <Sparkles className="w-4 h-4 text-meadow-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-meadow-600 leading-tight">
            Tap Any Animal Friend to Hear Its Sound!
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">
            Meet 20 farm, safari, jungle, and ocean animals!
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
                  <span>Pause Safari Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Recite All 20 Animals 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Animals Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {ANIMAL_ITEMS.map((item) => {
            const isActive = activeAnimal === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleAnimalTap(item)}
                className={`p-3 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition duration-150 kid-btn-pop relative ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-400 to-meadow-500 text-white border-white scale-105 shadow-2xl ring-4 ring-emerald-300 z-10'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-gray-800'
                }`}
              >
                <div className="text-4xl md:text-5xl mb-1 filter drop-shadow-sm">
                  {item.emoji}
                </div>
                <div className={`font-black text-base md:text-lg leading-tight ${isActive ? 'text-white' : 'text-emerald-950'}`}>
                  {item.name}
                </div>
                <div className={`text-[11px] font-black mt-0.5 ${isActive ? 'text-yellow-200' : 'text-emerald-700'}`}>
                  "{item.sound}"
                </div>
                <div className={`text-[10px] font-bold ${isActive ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {item.habitat}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 border-t-2 border-meadow-100 flex justify-center">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="w-full max-w-md py-3 rounded-2xl bg-meadow-500 hover:bg-meadow-600 text-white font-black text-base shadow-md kid-btn-pop"
          >
            Done with Animals 🦁
          </button>
        </div>
      </div>
    </div>
  );
};
