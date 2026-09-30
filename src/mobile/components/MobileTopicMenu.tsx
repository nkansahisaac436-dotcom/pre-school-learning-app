import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';
import type { Lesson } from '../../types';

export const MobileTopicMenu: React.FC = () => {
  const { 
    selectedTopic, 
    lessons, 
    startLesson, 
    activeProfile, 
    setScreen 
  } = useMobileApp();

  if (!selectedTopic) return null;

  const topicLessons = lessons.filter((l) => l.topicId === selectedTopic.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => {
            nativeSpeech.stop();
            setScreen('home');
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>⬅️ Home</Text>
        </TouchableOpacity>

        <Text style={styles.topicHeaderTitle}>
          {selectedTopic.iconEmoji} {selectedTopic.name}
        </Text>
      </View>

      <Text style={styles.chooseText}>Choose a fun song to sing! 🎵</Text>

      {/* Lessons List */}
      <View style={styles.lessonsList}>
        {topicLessons.map((lesson: Lesson) => {
          const isDone = activeProfile.completedLessons.includes(lesson.id);

          return (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => startLesson(lesson)}
              style={styles.lessonCard}
              activeOpacity={0.85}
            >
              <View style={styles.lessonEmojiBox}>
                <Text style={styles.lessonEmoji}>{lesson.thumbnailEmoji}</Text>
              </View>

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDesc} numberOfLines={2}>
                  {lesson.description}
                </Text>
              </View>

              <View style={styles.lessonPlayAction}>
                <Text style={styles.playIcon}>{isDone ? '⭐' : '▶️'}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fffbeb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#334155',
  },
  topicHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#78350f',
  },
  chooseText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 16,
    textAlign: 'center',
  },
  lessonsList: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#fde68a',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  lessonEmojiBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonEmoji: {
    fontSize: 32,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 2,
  },
  lessonDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  lessonPlayAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
});
