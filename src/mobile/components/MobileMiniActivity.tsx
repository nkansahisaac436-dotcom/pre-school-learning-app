import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';
import type { ActivityOption } from '../../types';

export const MobileMiniActivity: React.FC = () => {
  const { selectedLesson, finishActivityToReward, completeCurrentLesson, setScreen } = useMobileApp();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!selectedLesson?.activity) return null;
  const { activity } = selectedLesson;

  const handleOptionTap = (option: ActivityOption) => {
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      nativeSpeech.speakCheer(activity.feedbackSuccessText || 'Hooray! That is correct!');
      completeCurrentLesson();
      setTimeout(() => {
        finishActivityToReward();
      }, 1200);
    } else {
      nativeSpeech.speakEncouragement();
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Prompt Card */}
      <View style={styles.promptCard}>
        <TouchableOpacity
          onPress={() => nativeSpeech.speak(activity.audioPromptText || activity.questionPrompt)}
          style={styles.speakerBtn}
        >
          <Text style={styles.speakerEmoji}>🔊</Text>
        </TouchableOpacity>

        <Text style={styles.promptText}>{activity.questionPrompt}</Text>
        <Text style={styles.listenHint}>Tap speaker or options to listen!</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {activity.options.map((option: ActivityOption) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionTap(option)}
              style={[
                styles.optionBtn,
                isSelected && option.isCorrect && styles.correctOption,
                isSelected && !option.isCorrect && styles.wrongOption,
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.optionEmoji}>{option.imageEmoji || '⭐'}</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Exit Button */}
      <TouchableOpacity
        onPress={() => {
          nativeSpeech.stop();
          setScreen('topic-menu');
        }}
        style={styles.exitBtn}
      >
        <Text style={styles.exitText}>Skip Game ➡️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffbeb',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#f59e0b',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  speakerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  speakerEmoji: {
    fontSize: 24,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 24,
  },
  listenHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
    marginTop: 4,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
    marginVertical: 16,
  },
  optionBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 3.5,
    borderColor: '#fde68a',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  wrongOption: {
    borderColor: '#f43f5e',
    backgroundColor: '#ffe4e6',
  },
  optionEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    flex: 1,
  },
  exitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
  },
  exitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
  },
});
