import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Play, Pause, RotateCcw, ArrowRight, Music, Volume2 } from 'lucide-react';

export const LessonPlayer: React.FC = () => {
  const { selectedLesson, finishLessonToActivity, setScreen, settings } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  const duration = selectedLesson?.durationSeconds || 45;
  const timerRef = useRef<number | null>(null);
  const lastRecitedLyricIdx = useRef<number>(-1);

  // Recite first lyric when starting
  useEffect(() => {
    if (selectedLesson?.lyrics && selectedLesson.lyrics.length > 0 && isPlaying) {
      const firstLyric = selectedLesson.lyrics[0];
      lastRecitedLyricIdx.current = 0;
      if (settings.voiceNarrationEnabled) {
        setTimeout(() => {
          voiceAssistant.reciteLyric(firstLyric.text);
        }, 500);
      }
    }
  }, [selectedLesson, settings.voiceNarrationEnabled]);

  // Synchronize playback timer & voice recitation
  useEffect(() => {
    if (!selectedLesson) return;

    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;

          // Check lyrics update
          if (selectedLesson.lyrics) {
            let nextLyricIdx = 0;
            for (let i = 0; i < selectedLesson.lyrics.length; i++) {
              if (selectedLesson.lyrics[i].timeSec <= next) {
                nextLyricIdx = i;
              }
            }

            setActiveLyricIndex(nextLyricIdx);

            // If a new lyric line has arrived, RECITE IT ALOUD!
            if (nextLyricIdx !== lastRecitedLyricIdx.current) {
              lastRecitedLyricIdx.current = nextLyricIdx;
              const currentLyricObj = selectedLesson.lyrics[nextLyricIdx];
              if (currentLyricObj && settings.voiceNarrationEnabled) {
                voiceAssistant.reciteLyric(currentLyricObj.text);
              }
            }
          }

          // Gentle musical rhythmic melody
          if (next % 3 === 0) {
            const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 1046.5];
            const randomNote = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
            soundEffects.playNote(randomNote, 0.25);
          }

          // When lesson ends, auto launch mini-activity!
          if (next >= duration) {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
            }
            setTimeout(() => {
              finishLessonToActivity();
            }, 1000);
            return duration;
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      voiceAssistant.stop();
    }

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, selectedLesson, finishLessonToActivity, settings.voiceNarrationEnabled]);

  if (!selectedLesson) {
    return null;
  }

  const handlePlayPause = () => {
    soundEffects.playPop();
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState && selectedLesson.lyrics) {
      const currentLyric = selectedLesson.lyrics[activeLyricIndex];
      if (currentLyric) {
        voiceAssistant.reciteLyric(currentLyric.text);
      }
    } else {
      voiceAssistant.stop();
    }
  };

  const handleReplay = () => {
    soundEffects.playPop();
    voiceAssistant.stop();
    setElapsedSec(0);
    setActiveLyricIndex(0);
    lastRecitedLyricIdx.current = 0;
    setIsPlaying(true);
    if (selectedLesson.lyrics && selectedLesson.lyrics[0]) {
      setTimeout(() => {
        voiceAssistant.reciteLyric(selectedLesson.lyrics![0].text);
      }, 400);
    }
  };

  const handleManualRecite = () => {
    soundEffects.playPop();
    if (currentLyric) {
      voiceAssistant.reciteLyric(currentLyric.text);
    }
  };

  const handleNextToActivity = () => {
    voiceAssistant.stop();
    soundEffects.playSparkleStar();
    finishLessonToActivity();
  };

  const progressPercent = Math.min(100, (elapsedSec / duration) * 100);
  const currentLyric = selectedLesson.lyrics ? selectedLesson.lyrics[activeLyricIndex] : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3 md:py-6 flex flex-col items-center select-none">
      {/* Top minimal header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            voiceAssistant.stop();
            setScreen('topic-menu');
          }}
          className="px-4 py-2 bg-white/90 border-2 border-amber-300 rounded-2xl font-black text-sm text-gray-700 kid-btn-pop"
        >
          ⬅️ Back to Songs
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-black text-sm">
          <Music className="w-4 h-4 text-amber-700 animate-bounce" />
          <span>{selectedLesson.title}</span>
        </div>

        <button
          onClick={handleNextToActivity}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-600 text-white rounded-2xl font-black text-sm flex items-center gap-1 kid-btn-pop shadow"
        >
          <span>Game ⭐</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Video & Visualizer Screen */}
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 relative">
        {/* If custom media URL is provided and is a video embed */}
        {selectedLesson.mediaUrl ? (
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            {selectedLesson.mediaUrl.includes('youtube.com') || selectedLesson.mediaUrl.includes('youtu.be') ? (
              <iframe
                src={selectedLesson.mediaUrl}
                title={selectedLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={selectedLesson.mediaUrl}
                controls
                autoPlay={isPlaying}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : (
          /* Interactive Animated Music Visualizer Stage with Real-Time Vocal Recitation */
          <div
            className="w-full aspect-video sm:min-h-[420px] relative flex flex-col items-center justify-between p-6 overflow-hidden"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${selectedLesson.accentColor}30 0%, #fffbeb 60%, ${selectedLesson.accentColor}15 100%)`,
            }}
          >
            {/* Floating Background Stars & Bubbles */}
            <div className="absolute top-6 left-8 text-4xl animate-bounce-slow opacity-60">✨</div>
            <div className="absolute top-12 right-12 text-4xl animate-float-star opacity-60">🌟</div>
            <div className="absolute bottom-16 left-12 text-3xl animate-wiggle opacity-60">🎈</div>
            <div className="absolute bottom-14 right-16 text-4xl animate-bounce-slow opacity-60">🎵</div>

            {/* Central Animated Scene Theme */}
            <div className="my-auto flex flex-col items-center justify-center text-center z-10 w-full">
              {/* Theme-specific big animated character */}
              <div className="relative mb-4">
                <div
                  className={`w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-2xl border-4 border-white ${
                    isPlaying ? 'animate-bounce-slow' : ''
                  }`}
                  style={{ backgroundColor: `${selectedLesson.accentColor}35` }}
                >
                  <span className="filter drop-shadow-lg">
                    {currentLyric?.highlightEmoji || selectedLesson.thumbnailEmoji}
                  </span>
                </div>

                {/* Pulsing musical ripples */}
                {isPlaying && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-25 pointer-events-none"
                      style={{ animationDuration: '2s' }}
                    />
                    <div className="absolute -top-3 -right-3 text-3xl animate-bounce">🎶</div>
                    <div className="absolute -bottom-2 -left-2 text-3xl animate-wiggle">⭐</div>
                  </>
                )}
              </div>

              {/* Karaoke Bouncing Lyric Banner with Read-Aloud Voice Feedback */}
              {currentLyric && (
                <div 
                  onClick={handleManualRecite}
                  className="px-6 py-3.5 rounded-2xl bg-white/95 backdrop-blur border-3 border-amber-400 shadow-xl max-w-2xl animate-pop-in cursor-pointer hover:scale-102 transition"
                  title="Tap to hear recitation again"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Volume2 className="w-6 h-6 text-rose-500 animate-pulse flex-shrink-0" />
                    <p className="text-xl md:text-3xl font-black text-gray-900 leading-snug">
                      {currentLyric.text}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 block mt-1">
                    🎙️ Voice Reciting in Real-Time (Tap to repeat line)
                  </span>
                </div>
              )}
            </div>

            {/* Progress Slider Display for Toddlers */}
            <div className="w-full z-10 mt-auto pt-4">
              <div className="w-full bg-white/80 rounded-full h-5 p-1 border-2 border-amber-300 shadow-inner relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-black text-amber-900 mt-1 px-1">
                <span>{elapsedSec}s</span>
                <span>{duration}s</span>
              </div>
            </div>
          </div>
        )}

        {/* Oversized Toddler Controls Bar */}
        <div className="bg-amber-50 border-t-4 border-amber-300 p-4 md:p-6 flex items-center justify-center gap-4 md:gap-8">
          {/* Replay Button */}
          <button
            onClick={handleReplay}
            aria-label="Replay song from start"
            className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-300 hover:bg-amber-400 border-4 border-amber-500 text-amber-950 flex flex-col items-center justify-center shadow-lg kid-btn-pop active:scale-95 transition"
            title="Replay from beginning"
          >
            <RotateCcw className="w-8 h-8 stroke-[3]" />
            <span className="text-[10px] font-black uppercase">Replay</span>
          </button>

          {/* Big Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause song' : 'Play song'}
            className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 text-white flex flex-col items-center justify-center shadow-2xl kid-btn-pop active:scale-95 transition ${
              isPlaying
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-600'
                : 'bg-gradient-to-br from-emerald-400 to-green-600 border-green-700'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 md:w-14 md:h-14 fill-white" />
            ) : (
              <Play className="w-12 h-12 md:w-14 md:h-14 fill-white translate-x-1" />
            )}
            <span className="text-xs font-black uppercase tracking-wider mt-0.5">
              {isPlaying ? 'Pause' : 'Sing!'}
            </span>
          </button>

          {/* Skip straight to Mini-Activity Button */}
          <button
            onClick={handleNextToActivity}
            aria-label="Go to fun game"
            className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-emerald-400 hover:bg-emerald-500 border-4 border-emerald-600 text-white flex flex-col items-center justify-center shadow-lg kid-btn-pop active:scale-95 transition"
            title="Go to Game"
          >
            <ArrowRight className="w-8 h-8 stroke-[3]" />
            <span className="text-[10px] font-black uppercase">Game ⭐</span>
          </button>
        </div>
      </div>
    </div>
  );
};
