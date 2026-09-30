import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileApp } from '../context/MobileAppContext';
import { nativeSpeech } from '../services/nativeSpeech';

export const MobileHeader: React.FC = () => {
  const { activeProfile, navigateHome, setActiveModal } = useMobileApp();

  return (
    <View style={styles.header}>
      {/* Home / Logo */}
      <TouchableOpacity 
        onPress={navigateHome} 
        style={styles.logoBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.logoEmoji}>🎈</Text>
        <Text style={styles.logoText}>ikj_system</Text>
      </TouchableOpacity>

      {/* Badges & Stars */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => {
            setActiveModal('badges');
            nativeSpeech.speak('Look at all your shiny badges and stars!');
          }}
          style={styles.starPill}
          activeOpacity={0.8}
        >
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={styles.starText}>{activeProfile.starsCount || 0}</Text>
        </TouchableOpacity>

        {/* Parent Gate Button */}
        <TouchableOpacity
          onPress={() => {
            setActiveModal('parent-gate');
          }}
          style={styles.parentBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.parentEmoji}>🔒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 3,
    borderBottomColor: '#fde68a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  logoEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350f',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  starEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  starText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#78350f',
  },
  parentBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentEmoji: {
    fontSize: 16,
  },
});
