import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';

export const MobileParentDashboard: React.FC = () => {
  const { activeProfile, setScreen, lessons } = useMobileApp();

  const minutesSpent = Math.floor(activeProfile.totalTimeSpentSeconds / 60);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setScreen('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>⬅️ Exit Parent Mode</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Dashboard</Text>
      </View>

      {/* Profile Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.childAvatar}>🦁</Text>
        <Text style={styles.childName}>{activeProfile.name} (Age {activeProfile.age})</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{activeProfile.completedLessons.length}</Text>
            <Text style={styles.metricLabel}>Lessons Done</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{activeProfile.starsCount}</Text>
            <Text style={styles.metricLabel}>Stars Won</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{minutesSpent}m</Text>
            <Text style={styles.metricLabel}>Time Spent</Text>
          </View>
        </View>
      </View>

      {/* Completed Lessons List */}
      <Text style={styles.sectionHeading}>Completed Lessons</Text>
      <View style={styles.lessonsList}>
        {lessons.map((lesson) => {
          const isDone = activeProfile.completedLessons.includes(lesson.id);
          return (
            <View key={lesson.id} style={styles.lessonItem}>
              <Text style={styles.itemEmoji}>{lesson.thumbnailEmoji}</Text>
              <Text style={styles.itemTitle}>{lesson.title}</Text>
              <Text style={styles.itemStatus}>{isDone ? '✅ Done' : '⏳ In Progress'}</Text>
            </View>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  childAvatar: {
    fontSize: 50,
    marginBottom: 6,
  },
  childName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2563eb',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
  },
  lessonsList: {
    gap: 8,
  },
  lessonItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  itemEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  itemStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
});
