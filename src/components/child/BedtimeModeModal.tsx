import React, { useState, useEffect } from 'react';
import { INITIAL_LESSONS } from '../../data/initialContent';
import { musicEngine } from '../../services/musicEngine';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Moon, Star, Sparkles, X, Play, Pause } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BedtimeModeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const lullabies = INITIAL_LESSONS.filter((l) => l.isBedtimeLullaby || l.id === 'lesson_goodnight_lullaby' || l.id === 'lesson_twinkle_star');

  useEffect(() => {
    if (isOpen) {
      musicEngine.setBedtimeMode(true);
      voiceAssistant.setRate(0.85);
      voiceAssistant.setPitch(1.05);
      voiceAssistant.speak('Goodnight Little Spark. Time for sweet dreams and soft lullabies.');
    } else {
      musicEngine.setBedtimeMode(false);
      musicEngine.stopMelodyTrack();
      voiceAssistant.setRate(1.05);
      voiceAssistant.setPitch(1.25);
      setIsPlayingLullaby(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLullaby = lullabies[currentSongIndex] || lullabies[0];

  const handleTogglePlay = () => {
    if (isPlayingLullaby) {
      setIsPlayingLullaby(false);
      musicEngine.stopMelodyTrack();
      voiceAssistant.stop();
    } else {
      setIsPlayingLullaby(true);
      musicEngine.startMelodyTrack(76, 'lullaby_stars');
      if (currentLullaby && currentLullaby.lyrics) {
        const fullLyrics = currentLullaby.lyrics.map((l) => l.text).join(' ... ');
        voiceAssistant.speak(fullLyrics, () => {
          setIsPlayingLullaby(false);
          musicEngine.stopMelodyTrack();
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md text-indigo-100 select-none animate-pop-in">
      <div className="w-full max-w-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-indigo-700/60 relative text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => {
            musicEngine.stopMelodyTrack();
            voiceAssistant.stop();
            onClose();
          }}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-indigo-900 hover:bg-indigo-800 border-2 border-indigo-600 flex items-center justify-center text-indigo-200 text-xl font-bold shadow-md"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Night Sky Icon */}
        <div className="w-24 h-24 rounded-full bg-indigo-800/40 border-4 border-indigo-500/50 flex items-center justify-center shadow-inner mb-4 relative">
          <Moon className="w-12 h-12 text-yellow-300 animate-pulse" />
          <Star className="w-5 h-5 text-yellow-200 absolute top-3 right-4 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/80 text-yellow-200 font-black text-sm mb-2 border border-indigo-700">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>🌙 Calm Bedtime Mode</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white">
          Soft Lullabies for Sweet Dreams
        </h2>
        <p className="text-sm text-indigo-300 mt-1 max-w-md">
          Dim lights, slow melodies, and gentle rhymes to help your little one drift peacefully to sleep.
        </p>

        {/* Current Lullaby Card */}
        <div className="w-full bg-indigo-900/50 border-2 border-indigo-600/50 rounded-2xl p-5 my-6">
          <span className="text-4xl mb-2 block">{currentLullaby.thumbnailEmoji}</span>
          <h3 className="text-xl font-black text-white">{currentLullaby.title}</h3>
          <p className="text-xs text-indigo-300 mt-1">{currentLullaby.description}</p>

          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={handleTogglePlay}
              className={`px-8 py-3.5 rounded-full font-black text-lg shadow-xl flex items-center gap-2 transition transform active:scale-95 ${
                isPlayingLullaby
                  ? 'bg-yellow-400 text-indigo-950 border-2 border-yellow-300 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-indigo-400'
              }`}
            >
              {isPlayingLullaby ? (
                <>
                  <Pause className="w-6 h-6" />
                  <span>Pause Lullaby</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>Play Lullaby 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lullabies Picker */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {lullabies.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => {
                setCurrentSongIndex(idx);
                setIsPlayingLullaby(false);
                musicEngine.stopMelodyTrack();
                voiceAssistant.stop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                currentSongIndex === idx
                  ? 'bg-indigo-500 text-white border-indigo-300'
                  : 'bg-indigo-900/40 text-indigo-300 border-indigo-700/60 hover:bg-indigo-800/60'
              }`}
            >
              {l.thumbnailEmoji} {l.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
