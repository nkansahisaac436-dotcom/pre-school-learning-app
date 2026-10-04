import React, { useState, useEffect } from 'react';
import type { MiniGameConfig, MiniGameOption } from '../../types';
import { voiceAssistant } from '../../services/voiceAssistant';
import { soundEffects } from '../../services/soundEffects';
import { musicEngine } from '../../services/musicEngine';
import { Sparkles, Trophy, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  config: MiniGameConfig;
  onComplete: () => void;
  onSkip: () => void;
}

export const MiniGamePlayer: React.FC<Props> = ({ config, onComplete, onSkip }) => {
  // Matching state
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  // Count stars state
  const [countedIds, setCountedIds] = useState<string[]>([]);

  // Find color / selection state
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  // Memory game state
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [memoryMatchedIds, setMemoryMatchedIds] = useState<string[]>([]);

  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    voiceAssistant.speak(config.prompt);
  }, [config]);

  // Handle Match Game Tap
  const handleMatchTap = (option: MiniGameOption) => {
    if (matchedIds.includes(option.id)) return;
    soundEffects.playPop();

    if (!selectedMatchId) {
      setSelectedMatchId(option.id);
      voiceAssistant.speak(option.label);
      return;
    }

    const firstOption = config.options.find((o) => o.id === selectedMatchId);
    if (!firstOption) {
      setSelectedMatchId(option.id);
      return;
    }

    if (firstOption.matchId === option.id || option.matchId === firstOption.id) {
      // Match found!
      const newMatched = [...matchedIds, firstOption.id, option.id];
      setMatchedIds(newMatched);
      setSelectedMatchId(null);
      musicEngine.playStarChime();
      voiceAssistant.speakCheer('Super match!');

      if (newMatched.length >= config.options.length) {
        handleWin();
      }
    } else {
      // Not a match
      setSelectedMatchId(null);
      voiceAssistant.speakEncouragement();
    }
  };

  // Handle Count Stars Tap
  const handleStarCountTap = (option: MiniGameOption) => {
    if (countedIds.includes(option.id)) return;
    const newCounted = [...countedIds, option.id];
    setCountedIds(newCounted);
    musicEngine.playStarChime();
    voiceAssistant.speakNumber(newCounted.length);

    if (newCounted.length >= (config.targetCount || config.options.length)) {
      handleWin();
    }
  };

  // Handle Find Color Tap
  const handleFindColorTap = (option: MiniGameOption) => {
    if (selectedTargets.includes(option.id)) return;
    if (option.isTarget) {
      const newTargets = [...selectedTargets, option.id];
      setSelectedTargets(newTargets);
      musicEngine.playStarChime();
      voiceAssistant.speakCheer(`Yes! ${option.label}!`);

      const totalTargets = config.options.filter((o) => o.isTarget).length;
      if (newTargets.length >= totalTargets) {
        handleWin();
      }
    } else {
      soundEffects.playPop();
      voiceAssistant.speakEncouragement();
    }
  };

  // Handle Memory Game Tap
  const handleMemoryTap = (option: MiniGameOption) => {
    if (memoryMatchedIds.includes(option.id) || flippedIds.includes(option.id)) return;
    soundEffects.playPop();

    const newFlipped = [...flippedIds, option.id];
    setFlippedIds(newFlipped);
    voiceAssistant.speak(option.label);

    if (newFlipped.length === 2) {
      const opt1 = config.options.find((o) => o.id === newFlipped[0]);
      const opt2 = config.options.find((o) => o.id === newFlipped[1]);

      if (opt1 && opt2 && (opt1.matchId === opt2.id || opt2.matchId === opt1.id)) {
        // Matched!
        const newMemoryMatched = [...memoryMatchedIds, opt1.id, opt2.id];
        setMemoryMatchedIds(newMemoryMatched);
        setFlippedIds([]);
        musicEngine.playStarChime();
        voiceAssistant.speakCheer('You found the pair!');

        if (newMemoryMatched.length >= config.options.length) {
          handleWin();
        }
      } else {
        // Flip back after brief pause
        setTimeout(() => {
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    setIsWon(true);
    musicEngine.playCelebrationFanfare();
    voiceAssistant.speak(config.feedbackText);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Safe ignore
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-300 text-center select-none animate-pop-in">
      {/* Mini Game Header */}
      <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎮</span>
          <div className="text-left">
            <h3 className="font-black text-xl text-amber-900">{config.title}</h3>
            <p className="text-xs text-amber-700 font-semibold">Bonus Learning Game!</p>
          </div>
        </div>
        <button
          onClick={onSkip}
          className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
        >
          Skip Mini-Game ⏩
        </button>
      </div>

      {/* Prompt Banner */}
      <div className="bg-amber-100/80 border-2 border-amber-300 rounded-2xl p-4 mb-6">
        <p className="text-lg md:text-xl font-black text-amber-950">{config.prompt}</p>
      </div>

      {/* MATCHING GAME */}
      {config.type === 'matching' && (
        <div className="grid grid-cols-2 gap-4 my-6">
          {config.options.map((opt) => {
            const isMatched = matchedIds.includes(opt.id);
            const isSelected = selectedMatchId === opt.id;
            return (
              <button
                key={opt.id}
                disabled={isMatched}
                onClick={() => handleMatchTap(opt)}
                className={`h-24 rounded-3xl p-4 flex items-center justify-center gap-3 text-lg font-black transition transform active:scale-95 shadow-md border-4 ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-80'
                    : isSelected
                    ? 'bg-amber-300 border-amber-500 text-amber-950 scale-105 shadow-lg'
                    : 'bg-white border-amber-200 hover:border-amber-400 text-gray-800'
                }`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span>{opt.label}</span>
                {isMatched && <CheckCircle className="w-6 h-6 text-emerald-600 ml-auto" />}
              </button>
            );
          })}
        </div>
      )}

      {/* COUNT THE STARS GAME */}
      {config.type === 'count_stars' && (
        <div className="flex flex-wrap items-center justify-center gap-4 my-8">
          {config.options.map((opt, index) => {
            const isCounted = countedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                disabled={isCounted}
                onClick={() => handleStarCountTap(opt)}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex flex-col items-center justify-center text-4xl shadow-md border-4 transition transform active:scale-90 ${
                  isCounted
                    ? 'bg-amber-400 border-amber-500 scale-105 text-white'
                    : 'bg-white border-amber-200 hover:border-amber-400 hover:scale-105'
                }`}
              >
                <span>⭐</span>
                {isCounted && <span className="text-xs font-black text-amber-900 mt-1">{countedIds.indexOf(opt.id) + 1}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* FIND THE COLOR GAME */}
      {config.type === 'find_color' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {config.options.map((opt) => {
            const isSelected = selectedTargets.includes(opt.id);
            return (
              <button
                key={opt.id}
                disabled={isSelected}
                onClick={() => handleFindColorTap(opt)}
                className={`h-28 rounded-3xl p-3 flex flex-col items-center justify-center gap-2 text-base font-black shadow-md border-4 transition transform active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105'
                    : 'bg-white border-amber-200 hover:border-amber-400 text-gray-800'
                }`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span>{opt.label}</span>
                {isSelected && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}

      {/* MEMORY PAIRS GAME */}
      {config.type === 'memory' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {config.options.map((opt) => {
            const isFlipped = flippedIds.includes(opt.id) || memoryMatchedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                disabled={memoryMatchedIds.includes(opt.id)}
                onClick={() => handleMemoryTap(opt)}
                className={`h-28 rounded-3xl p-2 flex flex-col items-center justify-center text-lg font-black shadow-md border-4 transition transform active:scale-95 ${
                  isFlipped
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-amber-400 border-amber-500 text-amber-900 hover:bg-amber-300'
                }`}
              >
                {isFlipped ? (
                  <>
                    <span className="text-4xl">{opt.emoji}</span>
                    <span className="text-xs font-bold mt-1">{opt.label}</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-amber-900">❓</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Win Banner / Continue Button */}
      {isWon ? (
        <div className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex flex-col items-center gap-3">
          <p className="text-lg font-black text-emerald-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
            {config.feedbackText}
          </p>
          <button
            onClick={onComplete}
            className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg border-2 border-emerald-600 flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <span>Claim Your Star! ⭐</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => voiceAssistant.speak(config.prompt)}
            className="text-xs font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-4 py-2 rounded-full border border-amber-300 flex items-center gap-1.5"
          >
            <span>🔊 Repeat Game Prompt</span>
          </button>
        </div>
      )}
    </div>
  );
};
