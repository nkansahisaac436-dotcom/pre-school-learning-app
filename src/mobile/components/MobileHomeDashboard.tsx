import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';
import type { Topic } from '../../types';

export const MobileHomeDashboard: React.FC = () => {
  const { 
    topics, 
    lessons, 
    selectTopic, 
    activeProfile, 
    setActiveModal 
  } = useMobileApp();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeGreeting}>👋 Hello, {activeProfile.name}!</Text>
        <Text style={styles.welcomeTitle}>What should we learn today? 🎶</Text>
      </View>

      {/* Interactive Soundboard Launchers Horizontal Scroller / Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>✨ Interactive Touchboards</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {/* A to Z Touchboard */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('alphabet');
            nativeSpeech.speak('Welcome to A to Z Alphabet Touchboard! Tap any letter!');
          }}
          style={[styles.quickTile, { backgroundColor: '#f43f5e' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>🔤</Text>
          <Text style={styles.quickTitle}>A to Z Board</Text>
          <Text style={styles.quickSubtitle}>26 Letters</Text>
        </TouchableOpacity>

        {/* 1 to 100+ Numbers Grid */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('numbers');
            nativeSpeech.speak('Welcome to Numbers 1 to 100 and above! Tap any number!');
          }}
          style={[styles.quickTile, { backgroundColor: '#f59e0b' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>💯</Text>
          <Text style={styles.quickTitle}>1 to 100+ Grid</Text>
          <Text style={styles.quickSubtitle}>Count Aloud</Text>
        </TouchableOpacity>

        {/* Rainbow Colors */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('colors');
            nativeSpeech.speak('Welcome to Rainbow Colors! Tap any color!');
          }}
          style={[styles.quickTile, { backgroundColor: '#0ea5e9' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>🎨</Text>
          <Text style={styles.quickTitle}>Colors Palette</Text>
          <Text style={styles.quickSubtitle}>12 Colors</Text>
        </TouchableOpacity>

        {/* Shapes */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('shapes');
            nativeSpeech.speak('Welcome to Shapes and Stars! Tap any shape!');
          }}
          style={[styles.quickTile, { backgroundColor: '#8b5cf6' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>🔷</Text>
          <Text style={styles.quickTitle}>Shape Board</Text>
          <Text style={styles.quickSubtitle}>10 Shapes</Text>
        </TouchableOpacity>

        {/* Animals Safari */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('animals');
            nativeSpeech.speak('Welcome to Animal Safari and Farm Friends! Tap any animal!');
          }}
          style={[styles.quickTile, { backgroundColor: '#10b981' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>🦁</Text>
          <Text style={styles.quickTitle}>Safari Sounds</Text>
          <Text style={styles.quickSubtitle}>20 Animals</Text>
        </TouchableOpacity>

        {/* Good Habits */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('habits');
            nativeSpeech.speak('Welcome to Good Habits and Healthy Routines! Tap any habit!');
          }}
          style={[styles.quickTile, { backgroundColor: '#f97316' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.quickEmoji}>🧼</Text>
          <Text style={styles.quickTitle}>Healthy Hero</Text>
          <Text style={styles.quickSubtitle}>10 Habits</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Topic Tiles Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📚 Song & Video Topics</Text>
      </View>

      <View style={styles.topicsGrid}>
        {topics.map((topic: Topic) => {
          const topicLessons = lessons.filter((l) => l.topicId === topic.id);
          const completedCount = topicLessons.filter((l) =>
            activeProfile.completedLessons.includes(l.id)
          ).length;

          return (
            <TouchableOpacity
              key={topic.id}
              onPress={() => selectTopic(topic)}
              style={styles.topicCard}
              activeOpacity={0.85}
            >
              <View style={styles.topicBadgeRow}>
                <Text style={styles.topicCount}>
                  {completedCount}/{topicLessons.length} Done
                </Text>
              </View>

              <Text style={styles.topicEmoji}>{topic.iconEmoji}</Text>
              <Text style={styles.topicName}>{topic.name}</Text>
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
  welcomeBanner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeGreeting: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400e',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#451a03',
    textAlign: 'center',
  },
  sectionHeader: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350f',
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  quickTile: {
    width: 110,
    height: 110,
    borderRadius: 24,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  quickEmoji: {
    fontSize: 34,
    marginBottom: 4,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  quickSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.9,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#fde68a',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  topicBadgeRow: {
    width: '100%',
    alignItems: 'flex-start',
  },
  topicCount: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  topicEmoji: {
    fontSize: 54,
  },
  topicName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
  },
});
