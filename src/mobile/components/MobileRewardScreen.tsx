import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';

export const MobileRewardScreen: React.FC = () => {
  const { selectedLesson, startLesson, navigateHome, recentBadgeUnlocked } = useMobileApp();

  const handleSingAgain = () => {
    if (selectedLesson) {
      startLesson(selectedLesson);
    } else {
      navigateHome();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.trophyEmoji}>🏆</Text>
        <Text style={styles.title}>AWESOME JOB!</Text>
        <Text style={styles.subtitle}>You completed the lesson!</Text>

        {/* Stars Won */}
        <View style={styles.starsRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
        </View>
        <Text style={styles.starsText}>+3 Stars Added to Your Collection!</Text>

        {/* Badge Unlocked Notification */}
        {recentBadgeUnlocked && (
          <View style={styles.badgeUnlockedCard}>
            <Text style={styles.badgeEmoji}>{recentBadgeUnlocked.emoji}</Text>
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>New Badge: {recentBadgeUnlocked.title}!</Text>
              <Text style={styles.badgeDesc}>{recentBadgeUnlocked.description}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleSingAgain}
          style={styles.singAgainBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>🔁 SING AGAIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateHome}
          style={styles.homeBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>🏠 MORE SONGS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#f59e0b',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  trophyEmoji: {
    fontSize: 70,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#78350f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  star: {
    fontSize: 40,
  },
  starsText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#d97706',
    marginBottom: 16,
  },
  badgeUnlockedCard: {
    width: '100%',
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#78350f',
  },
  badgeDesc: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  singAgainBtn: {
    width: '100%',
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  homeBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
});
