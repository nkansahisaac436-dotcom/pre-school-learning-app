import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic, Lesson, Badge, ChildProfile } from '../../types';
import { 
  INITIAL_TOPICS, 
  INITIAL_LESSONS, 
  BADGES, 
  DEFAULT_CHILD_PROFILE 
} from '../../data/initialContent';
import { nativeSpeech } from '../services/nativeSpeech';

export type MobileScreen = 
  | 'splash'
  | 'home'
  | 'topic-menu'
  | 'lesson-player'
  | 'mini-activity'
  | 'reward'
  | 'parent-dashboard';

interface MobileAppContextType {
  screen: MobileScreen;
  setScreen: (screen: MobileScreen) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  
  topics: Topic[];
  lessons: Lesson[];
  badges: Badge[];
  activeProfile: ChildProfile;

  selectTopic: (topic: Topic) => void;
  startLesson: (lesson: Lesson) => void;
  finishLessonToActivity: () => void;
  finishActivityToReward: () => void;
  completeCurrentLesson: () => void;
  navigateHome: () => void;

  // Active Explorer Modals
  activeModal: 'none' | 'alphabet' | 'numbers' | 'colors' | 'shapes' | 'animals' | 'habits' | 'badges' | 'parent-gate';
  setActiveModal: (modal: 'none' | 'alphabet' | 'numbers' | 'colors' | 'shapes' | 'animals' | 'habits' | 'badges' | 'parent-gate') => void;
  recentBadgeUnlocked: Badge | null;
}

const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<MobileScreen>('splash');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeProfile, setActiveProfile] = useState<ChildProfile>(DEFAULT_CHILD_PROFILE);
  const [activeModal, setActiveModal] = useState<'none' | 'alphabet' | 'numbers' | 'colors' | 'shapes' | 'animals' | 'habits' | 'badges' | 'parent-gate'>('none');
  const [recentBadgeUnlocked, setRecentBadgeUnlocked] = useState<Badge | null>(null);

  // Time tracker
  useEffect(() => {
    if (screen === 'lesson-player' || screen === 'mini-activity') {
      const timer = setInterval(() => {
        setActiveProfile((prev) => ({
          ...prev,
          totalTimeSpentSeconds: prev.totalTimeSpentSeconds + 5,
        }));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [screen]);

  const selectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setScreen('topic-menu');
    nativeSpeech.speak(topic.voiceName || topic.name);
  };

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setScreen('lesson-player');
    nativeSpeech.speak('Let us sing: ' + lesson.title);
  };

  const finishLessonToActivity = () => {
    setScreen('mini-activity');
    if (selectedLesson?.activity.audioPromptText) {
      setTimeout(() => {
        nativeSpeech.speak(selectedLesson.activity.audioPromptText || selectedLesson.activity.questionPrompt);
      }, 300);
    }
  };

  const finishActivityToReward = () => {
    setScreen('reward');
    nativeSpeech.speakCheer('Superstar! You won 3 shiny stars!');
  };

  const navigateHome = () => {
    nativeSpeech.stop();
    setScreen('home');
  };

  const completeCurrentLesson = () => {
    if (!selectedLesson) return;
    const lessonId = selectedLesson.id;
    const topic = INITIAL_TOPICS.find((t) => t.id === selectedLesson.topicId);

    setActiveProfile((prev) => {
      const isAlreadyDone = prev.completedLessons.includes(lessonId);
      const newCompleted = isAlreadyDone ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const newStars = prev.starsCount + 3;
      const newBadges = [...prev.badgesEarned];

      let unlocked: Badge | null = null;
      if (topic?.badgeId && !newBadges.includes(topic.badgeId)) {
        newBadges.push(topic.badgeId);
        unlocked = BADGES.find((b) => b.id === topic.badgeId) || null;
      }

      if (unlocked) {
        setRecentBadgeUnlocked(unlocked);
      }

      return {
        ...prev,
        completedLessons: newCompleted,
        starsCount: newStars,
        badgesEarned: newBadges,
      };
    });
  };

  return (
    <MobileAppContext.Provider
      value={{
        screen,
        setScreen,
        selectedTopic,
        setSelectedTopic,
        selectedLesson,
        setSelectedLesson,
        topics: INITIAL_TOPICS,
        lessons: INITIAL_LESSONS,
        badges: BADGES,
        activeProfile,
        selectTopic,
        startLesson,
        finishLessonToActivity,
        finishActivityToReward,
        completeCurrentLesson,
        navigateHome,
        activeModal,
        setActiveModal,
        recentBadgeUnlocked,
      }}
    >
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const ctx = useContext(MobileAppContext);
  if (!ctx) throw new Error('useMobileApp must be used within MobileAppProvider');
  return ctx;
};
