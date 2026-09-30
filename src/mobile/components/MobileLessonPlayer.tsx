import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';

export const MobileLessonPlayer: React.FC = () => {
  const { selectedLesson, finishLessonToActivity, setScreen } = useMobileApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  const duration = selectedLesson?.durationSeconds || 22;
  const timerRef = useRef<number | null>(null);
  const lastRecitedIdx = useRef<number>(-1);

  // Recite first lyric when song starts
  useEffect(() => {
    if (selectedLesson?.lyrics && selectedLesson.lyrics.length > 0 && isPlaying) {
      lastRecitedIdx.current = 0;
      setTimeout(() => {
        nativeSpeech.reciteLyric(selectedLesson.lyrics![0].text);
      }, 300);
    }
  }, [selectedLesson]);

  // Fast sub-second playback loop
  useEffect(() => {
    if (!selectedLesson) return;

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => {
          const next = +(prev + 0.25).toFixed(2);

          if (selectedLesson.lyrics) {
            let nextLyricIdx = 0;
            for (let i = 0; i < selectedLesson.lyrics.length; i++) {
              if (selectedLesson.lyrics[i].timeSec <= next) {
                nextLyricIdx = i;
              }
            }

            setActiveLyricIndex(nextLyricIdx);

            if (nextLyricIdx !== lastRecitedIdx.current) {
              lastRecitedIdx.current = nextLyricIdx;
              const cur = selectedLesson.lyrics[nextLyricIdx];
              if (cur) {
                nativeSpeech.reciteLyric(cur.text);
              }
            }
          }

          if (next >= duration) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => {
              finishLessonToActivity();
            }, 600);
            return duration;
          }
          return next;
        });
      }, 250);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      nativeSpeech.stop();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, selectedLesson]);

  if (!selectedLesson) return null;

  const handlePlayPause = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (next && selectedLesson.lyrics) {
      const cur = selectedLesson.lyrics[activeLyricIndex];
      if (cur) nativeSpeech.reciteLyric(cur.text);
    } else {
      nativeSpeech.stop();
    }
  };

  const handleReplay = () => {
    nativeSpeech.stop();
    setElapsedSec(0);
    setActiveLyricIndex(0);
    lastRecitedIdx.current = 0;
    setIsPlaying(true);
    if (selectedLesson.lyrics && selectedLesson.lyrics[0]) {
      setTimeout(() => {
        nativeSpeech.reciteLyric(selectedLesson.lyrics![0].text);
      }, 250);
    }
  };

  const currentLyric = selectedLesson.lyrics ? selectedLesson.lyrics[activeLyricIndex] : null;
  const progressPercent = Math.min(100, (elapsedSec / duration) * 100);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => {
            nativeSpeech.stop();
            setScreen('topic-menu');
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>⬅️ Songs</Text>
        </TouchableOpacity>

        <Text style={styles.songTitle} numberOfLines={1}>
          {selectedLesson.title}
        </Text>

        <TouchableOpacity
          onPress={() => {
            nativeSpeech.stop();
            finishLessonToActivity();
          }}
          style={styles.gameBtn}
        >
          <Text style={styles.gameBtnText}>Game ⭐</Text>
        </TouchableOpacity>
      </View>

      {/* Main Visualizer Card */}
      <View style={styles.visualizerCard}>
        {/* Animated Mascot Emoji */}
        <View style={styles.mascotCircle}>
          <Text style={styles.mascotEmoji}>
            {currentLyric?.highlightEmoji || selectedLesson.thumbnailEmoji}
          </Text>
        </View>

        {/* Karaoke Lyric Banner */}
        {currentLyric && (
          <TouchableOpacity
            onPress={() => nativeSpeech.reciteLyric(currentLyric.text)}
            style={styles.lyricBanner}
            activeOpacity={0.8}
          >
            <Text style={styles.lyricText}>{currentLyric.text}</Text>
            <Text style={styles.tapToRepeat}>🎙️ Reciting Aloud (Tap to Repeat)</Text>
          </TouchableOpacity>
        )}

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.progressTimeRow}>
          <Text style={styles.timeText}>{Math.floor(elapsedSec)}s</Text>
          <Text style={styles.timeText}>{duration}s</Text>
        </View>
      </View>

      {/* Toddler Controls Bar */}
      <View style={styles.controlsBar}>
        {/* Replay */}
        <TouchableOpacity
          onPress={handleReplay}
          style={styles.smallControlBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.controlIcon}>🔄</Text>
          <Text style={styles.controlLabel}>REPLAY</Text>
        </TouchableOpacity>

        {/* Big Play / Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.bigPlayBtn, { backgroundColor: isPlaying ? '#f59e0b' : '#10b981' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.bigPlayIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
          <Text style={styles.bigPlayLabel}>{isPlaying ? 'PAUSE' : 'SING!'}</Text>
        </TouchableOpacity>

        {/* Skip to Activity Game */}
        <TouchableOpacity
          onPress={() => {
            nativeSpeech.stop();
            finishLessonToActivity();
          }}
          style={[styles.smallControlBtn, { backgroundColor: '#10b981' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.controlIcon}>⭐</Text>
          <Text style={styles.controlLabel}>GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fffbeb',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#334155',
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#78350f',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 6,
  },
  gameBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#059669',
  },
  gameBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  visualizerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#fde68a',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  mascotCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fef3c7',
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mascotEmoji: {
    fontSize: 70,
  },
  lyricBanner: {
    backgroundColor: '#fffbeb',
    borderWidth: 3,
    borderColor: '#f59e0b',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  lyricText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  tapToRepeat: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  progressTimeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  smallControlBtn: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: '#fde68a',
    borderWidth: 3,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 26,
  },
  controlLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#78350f',
    marginTop: 2,
  },
  bigPlayBtn: {
    width: 95,
    height: 95,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bigPlayIcon: {
    fontSize: 34,
  },
  bigPlayLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
});
