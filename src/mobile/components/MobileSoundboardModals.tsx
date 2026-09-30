import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';
import { numberToWords } from '../../constants/app';
import { 
  ALPHABET_A_TO_Z_ITEMS, 
  COLOR_ITEMS, 
  SHAPE_ITEMS, 
  ANIMAL_ITEMS, 
  HABIT_ITEMS 
} from '../../data/initialContent';

export const MobileSoundboardModals: React.FC = () => {
  const { activeModal, setActiveModal, badges, activeProfile, setScreen } = useMobileApp();
  const [checkedHabits, setCheckedHabits] = useState<string[]>([]);
  const [numberFilter, setNumberFilter] = useState<'all' | '10s' | '1-20'>('all');
  const [activeSpokenNumber, setActiveSpokenNumber] = useState<number | null>(null);
  const [isCountingAloud, setIsCountingAloud] = useState(false);

  const countAloudIndexRef = useRef(0);
  const countAloudTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeModal === 'none') {
      setIsCountingAloud(false);
      setActiveSpokenNumber(null);
      if (countAloudTimerRef.current) clearInterval(countAloudTimerRef.current);
    }
  }, [activeModal]);

  if (activeModal === 'none') return null;

  const handleClose = () => {
    nativeSpeech.stop();
    setIsCountingAloud(false);
    setActiveSpokenNumber(null);
    if (countAloudTimerRef.current) clearInterval(countAloudTimerRef.current);
    setActiveModal('none');
  };

  // Numbers dataset generator
  const numbers1to100 = Array.from({ length: 100 }, (_, i) => i + 1);
  const bigMilestones = [200, 500, 1000];
  let visibleNumbers = [...numbers1to100, ...bigMilestones];
  if (numberFilter === '10s') {
    visibleNumbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 500, 1000];
  } else if (numberFilter === '1-20') {
    visibleNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
  }

  const handleTapNumber = (num: number) => {
    setActiveSpokenNumber(num);
    // Speaks full word ("sixty-seven") and clears highlight on finish
    nativeSpeech.speakNumber(num, () => {
      setActiveSpokenNumber((prev) => (prev === num ? null : prev));
    });
  };

  const handleToggleCountAloud = () => {
    if (isCountingAloud) {
      setIsCountingAloud(false);
      nativeSpeech.stop();
      if (countAloudTimerRef.current) clearInterval(countAloudTimerRef.current);
    } else {
      setIsCountingAloud(true);
      countAloudIndexRef.current = 0;

      const playNext = () => {
        if (countAloudIndexRef.current >= visibleNumbers.length) {
          setIsCountingAloud(false);
          setActiveSpokenNumber(null);
          nativeSpeech.speakCheer('Awesome! You counted all the numbers!');
          return;
        }
        const curNum = visibleNumbers[countAloudIndexRef.current];
        setActiveSpokenNumber(curNum);
        nativeSpeech.speakNumber(curNum);
        countAloudIndexRef.current += 1;
      };

      playNext();
      countAloudTimerRef.current = setInterval(playNext, 1800) as unknown as number;
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with Close Button */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {activeModal === 'alphabet' && '🔤 A to Z Alphabet Board'}
              {activeModal === 'numbers' && '💯 1 to 100+ Numbers Grid'}
              {activeModal === 'colors' && '🎨 Rainbow Colors Palette'}
              {activeModal === 'shapes' && '🔷 Shapes & Stars Board'}
              {activeModal === 'animals' && '🦁 Safari & Farm Sounds'}
              {activeModal === 'habits' && '🧼 Good Habits Checklist'}
              {activeModal === 'badges' && '🏆 Your Badges & Stars'}
              {activeModal === 'parent-gate' && '🔒 Parent Gate Check'}
            </Text>

            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 1. ALPHABET MODAL */}
          {activeModal === 'alphabet' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <TouchableOpacity
                onPress={() => {
                  nativeSpeech.speak('A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z!');
                }}
                style={styles.reciteAllBtn}
              >
                <Text style={styles.reciteAllText}>Recite All 26 Letters 🎵</Text>
              </TouchableOpacity>

              <View style={styles.flexGrid}>
                {ALPHABET_A_TO_Z_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.letter}
                    onPress={() => nativeSpeech.speakLetter(item.letter, item.word)}
                    style={styles.letterTile}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.tileEmoji}>{item.emoji}</Text>
                    <Text style={styles.letterText}>{item.letter}</Text>
                    <Text style={styles.wordText}>{item.word}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* 2. NUMBERS MODAL (FIXED FULL WORD PRONUNCIATION) */}
          {activeModal === 'numbers' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              {/* Filter Tabs & Count Aloud */}
              <View style={styles.filterRow}>
                <TouchableOpacity 
                  onPress={() => {
                    setNumberFilter('all');
                    setIsCountingAloud(false);
                  }}
                  style={[styles.filterTab, numberFilter === 'all' && styles.filterTabActive]}
                >
                  <Text style={[styles.filterTabText, numberFilter === 'all' && styles.filterTabTextActive]}>1-100</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setNumberFilter('10s');
                    setIsCountingAloud(false);
                  }}
                  style={[styles.filterTab, numberFilter === '10s' && styles.filterTabActive]}
                >
                  <Text style={[styles.filterTabText, numberFilter === '10s' && styles.filterTabTextActive]}>By 10s</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setNumberFilter('1-20');
                    setIsCountingAloud(false);
                  }}
                  style={[styles.filterTab, numberFilter === '1-20' && styles.filterTabActive]}
                >
                  <Text style={[styles.filterTabText, numberFilter === '1-20' && styles.filterTabTextActive]}>1 to 20</Text>
                </TouchableOpacity>
              </View>

              {/* Count Aloud Button */}
              <TouchableOpacity
                onPress={handleToggleCountAloud}
                style={[styles.countAloudBtn, isCountingAloud && styles.countAloudBtnActive]}
                activeOpacity={0.85}
              >
                <Text style={styles.countAloudBtnText}>
                  {isCountingAloud ? '⏸️ Pause Counting' : '🎙️ Count Aloud Mode (1, 2, 3..)'}
                </Text>
              </TouchableOpacity>

              {/* Number Tiles Grid */}
              <View style={styles.numbersFlexGrid}>
                {visibleNumbers.map((num) => {
                  const isHighlighted = activeSpokenNumber === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      onPress={() => handleTapNumber(num)}
                      style={[
                        styles.numberTile,
                        isHighlighted && styles.numberTileHighlighted,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.numberTileText, isHighlighted && styles.numberTileTextHighlighted]}>
                        {num}
                      </Text>
                      <Text style={[styles.numberWordHint, isHighlighted && styles.numberWordHintHighlighted]}>
                        {numberToWords(num)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* 3. COLORS MODAL */}
          {activeModal === 'colors' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <View style={styles.flexGrid}>
                {COLOR_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => nativeSpeech.speak(`${item.name}! Like a ${item.sample}!`)}
                    style={[styles.colorTile, { backgroundColor: item.hex }]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.colorEmoji}>{item.emoji}</Text>
                    <Text style={styles.colorName}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* 4. SHAPES MODAL */}
          {activeModal === 'shapes' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <View style={styles.flexGrid}>
                {SHAPE_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => nativeSpeech.speak(`${item.name}! ${item.desc}!`)}
                    style={styles.shapeTile}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.shapeEmoji}>{item.emoji}</Text>
                    <Text style={styles.shapeName}>{item.name}</Text>
                    <Text style={styles.shapeDesc}>{item.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* 5. ANIMALS MODAL */}
          {activeModal === 'animals' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <View style={styles.flexGrid}>
                {ANIMAL_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => nativeSpeech.speak(`${item.name}! Says ${item.sound}!`)}
                    style={styles.animalTile}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.animalEmoji}>{item.emoji}</Text>
                    <Text style={styles.animalName}>{item.name}</Text>
                    <Text style={styles.animalSound}>"{item.sound}"</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* 6. HABITS MODAL */}
          {activeModal === 'habits' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              {HABIT_ITEMS.map((item) => {
                const isChecked = checkedHabits.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                      setCheckedHabits((prev) =>
                        prev.includes(item.name) ? prev : [...prev, item.name]
                      );
                      nativeSpeech.speak(`${item.name}! ${item.phrase}!`);
                    }}
                    style={[styles.habitRow, isChecked && styles.habitRowChecked]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.habitEmoji}>{item.emoji}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName}>{item.name}</Text>
                      <Text style={styles.habitPhrase}>{item.phrase}</Text>
                    </View>
                    <Text style={styles.checkIcon}>{isChecked ? '✅' : '⚪'}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* 7. BADGES MODAL */}
          {activeModal === 'badges' && (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <View style={styles.flexGrid}>
                {badges.map((b) => {
                  const isWon = activeProfile.badgesEarned.includes(b.id);
                  return (
                    <View key={b.id} style={[styles.badgeTile, isWon && styles.badgeTileWon]}>
                      <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                      <Text style={styles.badgeTitle}>{b.title}</Text>
                      <Text style={styles.badgeStatus}>{isWon ? '✨ Won!' : '🔒 Locked'}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* 8. PARENT GATE MODAL */}
          {activeModal === 'parent-gate' && (
            <View style={styles.gateBox}>
              <Text style={styles.gateQuestion}>Parent Check: What is 4 + 5?</Text>
              <View style={styles.gateAnswersRow}>
                <TouchableOpacity
                  onPress={() => {
                    handleClose();
                    setScreen('parent-dashboard');
                  }}
                  style={styles.gateAnswerBtn}
                >
                  <Text style={styles.gateAnswerText}>9 (Correct)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.gateAnswerBtn}
                >
                  <Text style={styles.gateAnswerText}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.gateAnswerBtn}
                >
                  <Text style={styles.gateAnswerText}>8</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1e293b',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#64748b',
  },
  gridContainer: {
    paddingBottom: 30,
  },
  reciteAllBtn: {
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  reciteAllText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  flexGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  letterTile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff1f2',
    borderWidth: 2.5,
    borderColor: '#fda4af',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  tileEmoji: {
    fontSize: 26,
  },
  letterText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#e11d48',
  },
  wordText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9f1239',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#f59e0b',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  countAloudBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  countAloudBtnActive: {
    backgroundColor: '#f43f5e',
  },
  countAloudBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  numbersFlexGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  numberTile: {
    width: '22%',
    aspectRatio: 1.1,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  numberTileHighlighted: {
    backgroundColor: '#f59e0b',
    borderColor: '#b45309',
    transform: [{ scale: 1.08 }],
  },
  numberTileText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350f',
  },
  numberTileTextHighlighted: {
    color: '#ffffff',
  },
  numberWordHint: {
    fontSize: 7,
    fontWeight: '700',
    color: '#92400e',
    textAlign: 'center',
  },
  numberWordHintHighlighted: {
    color: '#fef3c7',
  },
  colorTile: {
    width: '47%',
    height: 80,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  colorEmoji: {
    fontSize: 30,
  },
  colorName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
  },
  shapeTile: {
    width: '47%',
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#c084fc',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  shapeEmoji: {
    fontSize: 34,
  },
  shapeName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#6b21a8',
  },
  shapeDesc: {
    fontSize: 10,
    color: '#9333ea',
  },
  animalTile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#6ee7b7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  animalEmoji: {
    fontSize: 28,
  },
  animalName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065f46',
  },
  animalSound: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 2,
    borderColor: '#fed7aa',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
  },
  habitRowChecked: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  habitEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1e293b',
  },
  habitPhrase: {
    fontSize: 11,
    color: '#64748b',
  },
  checkIcon: {
    fontSize: 20,
  },
  badgeTile: {
    width: '47%',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
  },
  badgeTileWon: {
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  badgeEmoji: {
    fontSize: 34,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 4,
    textAlign: 'center',
  },
  badgeStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706',
    marginTop: 2,
  },
  gateBox: {
    padding: 20,
    alignItems: 'center',
  },
  gateQuestion: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 20,
  },
  gateAnswersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gateAnswerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
  },
  gateAnswerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});
