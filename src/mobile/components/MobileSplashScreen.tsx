import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';
import { APP_NAME, APP_TAGLINE, MASCOT_NAME } from '../../constants/app';

export const MobileSplashScreen: React.FC = () => {
  const { setScreen } = useMobileApp();

  const handleStart = () => {
    nativeSpeech.speak(`Welcome to ${APP_NAME}! I am ${MASCOT_NAME}! Let us sing and learn together!`);
    setScreen('home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/sparky.png')}
          style={styles.mascotImg}
          resizeMode="contain"
        />
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>{APP_TAGLINE}</Text>

        <View style={styles.topicsRow}>
          <Text style={styles.miniIcon}>🔤</Text>
          <Text style={styles.miniIcon}>💯</Text>
          <Text style={styles.miniIcon}>🎨</Text>
          <Text style={styles.miniIcon}>🔷</Text>
          <Text style={styles.miniIcon}>🦁</Text>
          <Text style={styles.miniIcon}>🧼</Text>
        </View>

        <TouchableOpacity
          onPress={handleStart}
          style={styles.playButton}
          activeOpacity={0.85}
        >
          <Text style={styles.playButtonText}>TAP TO PLAY 🚀</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#f59e0b',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  mascotImg: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#78350f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 18,
  },
  topicsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  miniIcon: {
    fontSize: 26,
  },
  playButton: {
    width: '100%',
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#059669',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
