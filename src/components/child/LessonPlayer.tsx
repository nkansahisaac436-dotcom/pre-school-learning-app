import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { musicEngine } from '../../services/musicEngine';
import { Play, Pause, RotateCcw, ArrowRight, Music, Volume2, Sparkles, Heart, Gauge } from 'lucide-react';
import { MiniGamePlayer } from './MiniGamePlayer';

export const LessonPlayer: React.FC = () => {
  const { selectedLesson, finishLessonToActivity, setScreen, settings, activeProfile, updateProfile } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.8 | 1.0 | 1.2>(1.0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [tapSparkles, setTapSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const duration = selectedLesson?.durationSeconds || 30;
  const timerRef = useRef<number | null>(null);
  const lastRecitedLyricIdx = useRef<number>(-1);

  useEffect(() => {
    if (selectedLesson && activeProfile) {
      setIsFavorite(activeProfile.favoriteLessonIds?.includes(selectedLesson.id) || false);
    }
  }, [selectedLesson, activeProfile]);

  // Start background melody and voice narration
  useEffect(() => {
    if (!selectedLesson) return;

    musicEngine.startMelodyTrack(selectedLesson.bpm || 96, selectedLesson.interactiveTheme || 'alphabet_dance');

    if (selectedLesson.lyrics && selectedLesson.lyrics.length > 0 && isPlaying) {
      const firstLyric = selectedLesson.lyrics[0];
      lastRecitedLyricIdx.current = 0;
      if (settings.voiceNarrationEnabled) {
        setTimeout(() => {
          voiceAssistant.reciteLyric(firstLyric.text);
        }, 200);
      }
    }

    return () => {
      musicEngine.stopMelodyTrack();
      voiceAssistant.stop();
    };
  }, [selectedLesson, settings.voiceNarrationEnabled]);

  // Playback timer & word-level karaoke sync loop
  useEffect(() => {
    if (!selectedLesson) return;

    if (isPlaying && !showMiniGame) {
      const intervalMs = 200;
      timerRef.current = window.setInterval(() => {
        setElapsedSec((prev) => {
          const step = +(0.2 * playbackSpeed).toFixed(2);
          const next = +(prev + step).toFixed(2);

          // Check lyrics update
          if (selectedLesson.lyrics) {
            let nextLyricIdx = 0;
            for (let i = 0; i < selectedLesson.lyrics.length; i++) {
              if (selectedLesson.lyrics[i].timeSec <= next) {
                nextLyricIdx = i;
              }
            }

            setActiveLyricIndex(nextLyricIdx);
            const curLyricObj = selectedLesson.lyrics[nextLyricIdx];

            // Word-level karaoke position
            if (curLyricObj && curLyricObj.words) {
              const curWordIdx = curLyricObj.words.findIndex(
                (w) => next >= w.startSec && next <= w.endSec
              );
              setActiveWordIndex(curWordIdx >= 0 ? curWordIdx : 0);
            }

            // Recite next line when entering
            if (nextLyricIdx !== lastRecitedLyricIdx.current) {
              lastRecitedLyricIdx.current = nextLyricIdx;
              if (curLyricObj && settings.voiceNarrationEnabled) {
                soundEffects.playNote(440 + (nextLyricIdx % 6) * 50, 0.15);
                voiceAssistant.reciteLyric(curLyricObj.text);
              }
            }
          }

          // When song finishes
          if (next >= duration) {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
            }
            musicEngine.stopMelodyTrack();
            if (selectedLesson.miniGame) {
              setShowMiniGame(true);
            } else {
              setTimeout(() => {
                finishLessonToActivity();
              }, 400);
            }
            return duration;
          }
          return next;
        });
      }, intervalMs);
    } else if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      voiceAssistant.stop();
      musicEngine.stopMelodyTrack();
    }

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, showMiniGame, duration, selectedLesson, playbackSpeed, finishLessonToActivity, settings.voiceNarrationEnabled]);

  if (!selectedLesson) return null;

  const currentLyric = selectedLesson.lyrics ? selectedLesson.lyrics[activeLyricIndex] : null;

  const handlePlayPause = () => {
    musicEngine.playPop();
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      musicEngine.startMelodyTrack(selectedLesson.bpm || 96, selectedLesson.interactiveTheme || 'alphabet_dance');
      if (currentLyric) voiceAssistant.reciteLyric(currentLyric.text);
    } else {
      musicEngine.stopMelodyTrack();
      voiceAssistant.stop();
    }
  };

  const handleReplay = () => {
    musicEngine.playPop();
    voiceAssistant.stop();
    setElapsedSec(0);
    setActiveLyricIndex(0);
    setActiveWordIndex(0);
    lastRecitedLyricIdx.current = 0;
    setShowMiniGame(false);
    setIsPlaying(true);
    musicEngine.startMelodyTrack(selectedLesson.bpm || 96, selectedLesson.interactiveTheme || 'alphabet_dance');
    if (selectedLesson.lyrics && selectedLesson.lyrics[0]) {
      setTimeout(() => {
        voiceAssistant.reciteLyric(selectedLesson.lyrics![0].text);
      }, 200);
    }
  };

  const handleToggleSpeed = () => {
    musicEngine.playPop();
    const speeds: (0.8 | 1.0 | 1.2)[] = [1.0, 0.8, 1.2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    voiceAssistant.setRate(newSpeed);
    voiceAssistant.speak(`Speed: ${newSpeed === 0.8 ? 'Slow' : newSpeed === 1.2 ? 'Fast' : 'Normal'}`);
  };

  const handleToggleFavorite = () => {
    musicEngine.playStarChime();
    const newFav = !isFavorite;
    setIsFavorite(newFav);
    if (activeProfile) {
      const currentFavs = activeProfile.favoriteLessonIds || [];
      const updatedFavs = newFav
        ? [...currentFavs, selectedLesson.id]
        : currentFavs.filter((id) => id !== selectedLesson.id);
      updateProfile({ favoriteLessonIds: updatedFavs });
      voiceAssistant.speak(newFav ? 'Added to your favorites!' : 'Removed from favorites');
    }
  };

  // Interactive Tap-Along on screen
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    musicEngine.playStarChime();
    const newSparkle = { id: Date.now(), x, y };
    setTapSparkles((prev) => [...prev.slice(-4), newSparkle]);

    setTimeout(() => {
      setTapSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 800);
  };

  // If MiniGame is triggered after song
  if (showMiniGame && selectedLesson.miniGame) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 animate-pop-in">
        <MiniGamePlayer
          config={selectedLesson.miniGame}
          onComplete={() => {
            setShowMiniGame(false);
            finishLessonToActivity();
          }}
          onSkip={() => {
            setShowMiniGame(false);
            finishLessonToActivity();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-3 md:p-6 select-none animate-fade-in">
      {/* Top Bar with Title, Favorites & Exit */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-3.5 md:p-4 rounded-3xl border-2 border-sunshine-300 shadow-sm">
        <button
          onClick={() => {
            musicEngine.stopMelodyTrack();
            voiceAssistant.stop();
            setScreen('home');
          }}
          className="px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-sm border border-amber-300 flex items-center gap-1 active:scale-95"
        >
          <span>⬅️ Back to Home</span>
        </button>

        <div className="text-center flex-1 mx-2">
          <h2 className="text-lg md:text-2xl font-black text-amber-900 leading-tight">
            {selectedLesson.title}
          </h2>
          <span className="text-xs text-amber-700 font-bold hidden sm:inline">
            {selectedLesson.description}
          </span>
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`p-2.5 rounded-2xl border-2 transition active:scale-90 ${
            isFavorite
              ? 'bg-rose-100 border-rose-400 text-rose-600'
              : 'bg-white border-gray-300 text-gray-400 hover:text-rose-500'
          }`}
          title="Favorite Song"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div
        onClick={handleScreenTap}
        className="relative bg-gradient-to-b from-sunshine-100 via-amber-50 to-orange-100 rounded-3xl border-4 border-sunshine-400 p-6 md:p-10 min-h-[360px] md:min-h-[420px] flex flex-col items-center justify-between shadow-xl overflow-hidden cursor-pointer"
      >
        {/* Tap Sparkles */}
        {tapSparkles.map((sp) => (
          <div
            key={sp.id}
            style={{ left: sp.x, top: sp.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-3xl animate-ping"
          >
            ⭐
          </div>
        ))}

        {/* Mascot Sparky Dancing & Status */}
        <div className="w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-sunshine-300 text-xs font-black text-amber-900 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tap Screen to Sparkle! ✨</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              {Math.floor(elapsedSec)}s / {duration}s
            </span>
          </div>
        </div>

        {/* Dancing Character & Stage Visual */}
        <div className="my-auto flex flex-col items-center justify-center gap-3">
          <div className="relative">
            {/* Sparky Mascot Dancing Animation */}
            <div
              className={`transform transition duration-300 ${
                isPlaying ? 'animate-bounce scale-110' : 'scale-100'
              }`}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 p-1 shadow-2xl border-4 border-white flex items-center justify-center relative">
                <img
                  src="/sparky.png"
                  alt="Sparky Mascot"
                  className="w-full h-full object-contain drop-shadow-md"
                  onError={(e) => {
                    // Fallback to cute star emoji if asset loading
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-6xl absolute">⭐</span>
              </div>
            </div>

            {isPlaying && (
              <span className="absolute -top-3 -right-3 text-2xl animate-spin">
                🎶
              </span>
            )}
          </div>

          <div className="text-center">
            <span className="text-4xl md:text-5xl drop-shadow-md">
              {currentLyric?.highlightEmoji || selectedLesson.thumbnailEmoji}
            </span>
          </div>
        </div>

        {/* KARAOKE SING-ALONG LYRICS WITH BOUNCING BALL */}
        {currentLyric && (
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 md:p-6 border-4 border-amber-400 shadow-lg text-center mt-2 relative">
            {/* Bouncing Musical Note Indicator */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1">
              <span>🎵 SING ALONG</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xl md:text-3xl font-black text-gray-800 my-2">
              {currentLyric.words && currentLyric.words.length > 0 ? (
                currentLyric.words.map((wordObj, wIdx) => {
                  const isCurrentWord = wIdx === activeWordIndex;
                  return (
                    <span
                      key={wIdx}
                      className={`relative px-1.5 py-0.5 rounded-xl transition duration-150 ${
                        isCurrentWord
                          ? 'text-amber-600 bg-amber-200/90 scale-110 shadow-sm border border-amber-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {/* Bouncing ball indicator over current word */}
                      {isCurrentWord && isPlaying && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-base animate-bounce">
                          ⭐
                        </span>
                      )}
                      {wordObj.word}
                    </span>
                  );
                })
              ) : (
                <span className="text-amber-900">{currentLyric.text}</span>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-amber-200/80 rounded-full h-3.5 mt-4 overflow-hidden border border-amber-300">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-200 rounded-full"
            style={{ width: `${Math.min(100, (elapsedSec / duration) * 100)}%` }}
          />
        </div>
      </div>

      {/* 64px+ Toddler-Friendly Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 p-4 rounded-3xl border-2 border-sunshine-300 shadow-md">
        {/* Play/Pause & Replay */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className={`min-w-[68px] min-h-[68px] rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg border-4 transition transform active:scale-90 ${
              isPlaying
                ? 'bg-amber-500 border-amber-600 hover:bg-amber-600'
                : 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600'
            }`}
            aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button
            onClick={handleReplay}
            className="min-w-[68px] min-h-[68px] rounded-3xl bg-amber-100 hover:bg-amber-200 border-4 border-amber-300 text-amber-900 flex items-center justify-center text-2xl shadow-md active:scale-90"
            title="Replay Song from Start"
          >
            <RotateCcw className="w-7 h-7" />
          </button>
        </div>

        {/* Speed Control Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSpeed}
            className="min-h-[56px] px-4 rounded-2xl bg-sunshine-100 hover:bg-sunshine-200 border-2 border-sunshine-300 text-sunshine-950 font-black text-sm flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Gauge className="w-5 h-5 text-amber-600" />
            <span>Speed: {playbackSpeed === 0.8 ? '0.8x Slow' : playbackSpeed === 1.2 ? '1.2x Fast' : '1.0x'}</span>
          </button>
        </div>

        {/* Next to Activity Button */}
        <button
          onClick={() => {
            musicEngine.stopMelodyTrack();
            voiceAssistant.stop();
            if (selectedLesson.miniGame) {
              setShowMiniGame(true);
            } else {
              finishLessonToActivity();
            }
          }}
          className="min-h-[64px] px-6 rounded-3xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-black text-lg shadow-lg border-4 border-orange-400 flex items-center gap-2 transform active:scale-95"
        >
          <span>Play Game!</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
