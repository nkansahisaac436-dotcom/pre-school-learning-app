import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ParentalGateModal } from './components/common/ParentalGateModal';
import { BadgeCollectionModal } from './components/common/BadgeCollectionModal';
import { AlphabetSoundboardModal } from './components/child/AlphabetSoundboardModal';
import { NumberExplorerModal } from './components/child/NumberExplorerModal';
import { ColorsExplorerModal } from './components/child/ColorsExplorerModal';
import { ShapesExplorerModal } from './components/child/ShapesExplorerModal';
import { AnimalsExplorerModal } from './components/child/AnimalsExplorerModal';
import { HabitsExplorerModal } from './components/child/HabitsExplorerModal';
import { SplashScreen } from './components/child/SplashScreen';
import { ProfileSetup } from './components/child/ProfileSetup';
import { HomeDashboard } from './components/child/HomeDashboard';
import { TopicMenu } from './components/child/TopicMenu';
import { LessonPlayer } from './components/child/LessonPlayer';
import { MiniActivity } from './components/child/MiniActivity';
import { RewardScreen } from './components/child/RewardScreen';
import { ParentDashboard } from './components/parent/ParentDashboard';

const MainLayout: React.FC = () => {
  const { 
    screen, 
    isAlphabetModalOpen, 
    closeAlphabetModal, 
    isNumberModalOpen, 
    closeNumberModal,
    isColorsModalOpen,
    closeColorsModal,
    isShapesModalOpen,
    closeShapesModal,
    isAnimalsModalOpen,
    closeAnimalsModal,
    isHabitsModalOpen,
    closeHabitsModal
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between select-none relative">
      {/* Show header in child screens except splash and parent dashboard */}
      {screen !== 'splash' && screen !== 'parent-dashboard' && screen !== 'profile-select' && (
        <Header />
      )}

      {/* Main Screen Content Router */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {screen === 'splash' && <SplashScreen />}
        {screen === 'profile-select' && <ProfileSetup />}
        {screen === 'home' && <HomeDashboard />}
        {screen === 'topic-menu' && <TopicMenu />}
        {screen === 'lesson-player' && <LessonPlayer />}
        {screen === 'mini-activity' && <MiniActivity />}
        {screen === 'reward' && <RewardScreen />}
        {screen === 'parent-dashboard' && <ParentDashboard />}
      </main>

      {/* Modals & Overlays */}
      <ParentalGateModal />
      <BadgeCollectionModal />
      <AlphabetSoundboardModal isOpen={isAlphabetModalOpen} onClose={closeAlphabetModal} />
      <NumberExplorerModal isOpen={isNumberModalOpen} onClose={closeNumberModal} />
      <ColorsExplorerModal isOpen={isColorsModalOpen} onClose={closeColorsModal} />
      <ShapesExplorerModal isOpen={isShapesModalOpen} onClose={closeShapesModal} />
      <AnimalsExplorerModal isOpen={isAnimalsModalOpen} onClose={closeAnimalsModal} />
      <HabitsExplorerModal isOpen={isHabitsModalOpen} onClose={closeHabitsModal} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
