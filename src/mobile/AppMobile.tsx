import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MobileAppProvider, useMobileApp } from './context/MobileAppContext';
import { MobileHeader } from './components/MobileHeader';
import { MobileSplashScreen } from './components/MobileSplashScreen';
import { MobileHomeDashboard } from './components/MobileHomeDashboard';
import { MobileTopicMenu } from './components/MobileTopicMenu';
import { MobileLessonPlayer } from './components/MobileLessonPlayer';
import { MobileMiniActivity } from './components/MobileMiniActivity';
import { MobileRewardScreen } from './components/MobileRewardScreen';
import { MobileParentDashboard } from './components/MobileParentDashboard';
import { MobileSoundboardModals } from './components/MobileSoundboardModals';

const MobileMainNavigator: React.FC = () => {
  const { screen } = useMobileApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {/* Show Header on main toddler screens */}
      {screen !== 'splash' && screen !== 'parent-dashboard' && <MobileHeader />}

      {/* Screen Router */}
      <View style={styles.content}>
        {screen === 'splash' && <MobileSplashScreen />}
        {screen === 'home' && <MobileHomeDashboard />}
        {screen === 'topic-menu' && <MobileTopicMenu />}
        {screen === 'lesson-player' && <MobileLessonPlayer />}
        {screen === 'mini-activity' && <MobileMiniActivity />}
        {screen === 'reward' && <MobileRewardScreen />}
        {screen === 'parent-dashboard' && <MobileParentDashboard />}
      </View>

      {/* Full Explorer Soundboard Modals Layer */}
      <MobileSoundboardModals />
    </SafeAreaView>
  );
};

export default function AppMobile() {
  return (
    <SafeAreaProvider>
      <MobileAppProvider>
        <MobileMainNavigator />
      </MobileAppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  content: {
    flex: 1,
  },
});
