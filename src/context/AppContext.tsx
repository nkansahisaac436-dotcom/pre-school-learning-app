import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { 
  ChildProfile, 
  Topic, 
  Lesson, 
  Badge, 
  ScreenState, 
  AppSettings,
  AvatarId 
} from '../types';
import { 
  INITIAL_TOPICS, 
  INITIAL_LESSONS, 
  BADGES, 
  DEFAULT_CHILD_PROFILE 
} from '../data/initialContent';
import { soundEffects } from '../services/soundEffects';
import { voiceAssistant } from '../services/voiceAssistant';

interface AppContextType {
  // Navigation & Screen
  screen: ScreenState;
  setScreen: (screen: ScreenState) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  navigateHome: () => void;
  selectTopicAndNavigate: (topic: Topic) => void;
  startLesson: (lesson: Lesson) => void;
  finishLessonToActivity: () => void;
  finishActivityToReward: () => void;

  // Child Profiles
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  setActiveProfileId: (id: string) => void;
  createProfile: (name: string, age: number, avatar: AvatarId) => void;
  updateProfile: (profile: ChildProfile) => void;
  deleteProfile: (id: string) => void;

  // Content Data
  topics: Topic[];
  lessons: Lesson[];
  badges: Badge[];
  addCustomLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (lessonId: string) => void;

  // Progress & Rewards
  completeCurrentLesson: () => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getEarnedBadges: () => Badge[];
  recentBadgeUnlocked: Badge | null;
  clearRecentBadge: () => void;
  
  // Parental Gate & Dashboard
  isParentGateOpen: boolean;
  openParentGate: () => void;
  closeParentGate: () => void;
  enterParentDashboard: () => void;
  exitParentDashboard: () => void;

  // Modals
  isBadgeModalOpen: boolean;
  openBadgeModal: () => void;
  closeBadgeModal: () => void;

  isAlphabetModalOpen: boolean;
  openAlphabetModal: () => void;
  closeAlphabetModal: () => void;

  isNumberModalOpen: boolean;
  openNumberModal: () => void;
  closeNumberModal: () => void;

  isColorsModalOpen: boolean;
  openColorsModal: () => void;
  closeColorsModal: () => void;

  isShapesModalOpen: boolean;
  openShapesModal: () => void;
  closeShapesModal: () => void;

  isAnimalsModalOpen: boolean;
  openAnimalsModal: () => void;
  closeAnimalsModal: () => void;

  isHabitsModalOpen: boolean;
  openHabitsModal: () => void;
  closeHabitsModal: () => void;

  // Settings & Audio
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleSound: () => void;
  toggleVoice: () => void;
}

const STORAGE_KEYS = {
  PROFILES: 'ikj_child_profiles_v1',
  ACTIVE_PROFILE_ID: 'ikj_active_profile_id_v1',
  SETTINGS: 'ikj_app_settings_v1',
  CUSTOM_LESSONS: 'ikj_custom_lessons_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  soundFxEnabled: true,
  voiceNarrationEnabled: true,
  speechRate: 0.95,
  speechPitch: 1.25,
  maxDailyMinutes: 30,
  volume: 0.8,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Screen State
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Modals
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isAlphabetModalOpen, setIsAlphabetModalOpen] = useState(false);
  const [isNumberModalOpen, setIsNumberModalOpen] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const [isShapesModalOpen, setIsShapesModalOpen] = useState(false);
  const [isAnimalsModalOpen, setIsAnimalsModalOpen] = useState(false);
  const [isHabitsModalOpen, setIsHabitsModalOpen] = useState(false);
  const [recentBadgeUnlocked, setRecentBadgeUnlocked] = useState<Badge | null>(null);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Profiles State
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [DEFAULT_CHILD_PROFILE];
  });

  const [activeProfileId, setActiveProfileIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      return saved || DEFAULT_CHILD_PROFILE.id;
    } catch {
      return DEFAULT_CHILD_PROFILE.id;
    }
  });

  // Lessons and Topics State (Seed + Custom)
  const [topics] = useState<Topic[]>(INITIAL_TOPICS);
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      if (custom) {
        const parsedCustom: Lesson[] = JSON.parse(custom);
        return [...INITIAL_LESSONS, ...parsedCustom];
      }
    } catch {
      // ignore
    }
    return INITIAL_LESSONS;
  });

  // Derived active profile
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_CHILD_PROFILE;

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
    soundEffects.setEnabled(settings.soundFxEnabled);
    soundEffects.setVolume(settings.volume);
    voiceAssistant.setEnabled(settings.voiceNarrationEnabled);
    voiceAssistant.setRate(settings.speechRate);
    voiceAssistant.setPitch(settings.speechPitch);
  }, [settings]);

  // Persist Profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  // Persist Active Profile ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, activeProfile.id);
    } catch {
      // ignore
    }
  }, [activeProfile.id]);

  // Time Tracker
  useEffect(() => {
    const isLearning = screen === 'lesson-player' || screen === 'mini-activity';
    if (!isLearning) return;

    const timer = window.setInterval(() => {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfile.id
            ? { ...p, totalTimeSpentSeconds: p.totalTimeSpentSeconds + 5 }
            : p
        )
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [screen, activeProfile.id]);

  // Actions
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.soundFxEnabled;
      soundEffects.setEnabled(next);
      if (next) soundEffects.playPop();
      return { ...prev, soundFxEnabled: next };
    });
  }, []);

  const toggleVoice = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.voiceNarrationEnabled;
      voiceAssistant.setEnabled(next);
      if (next) {
        voiceAssistant.speak('Voice assistant is on!');
      }
      return { ...prev, voiceNarrationEnabled: next };
    });
  }, []);

  const setActiveProfileId = useCallback((id: string) => {
    soundEffects.playPop();
    setActiveProfileIdState(id);
  }, []);

  const createProfile = useCallback((name: string, age: number, avatar: AvatarId) => {
    const newProf: ChildProfile = {
      id: 'child_' + Date.now(),
      name: name.trim() || 'Explorer',
      age: Math.max(2, Math.min(6, age)),
      avatar,
      completedLessons: [],
      badgesEarned: [],
      totalTimeSpentSeconds: 0,
      starsCount: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setProfiles((prev) => [...prev, newProf]);
    setActiveProfileIdState(newProf.id);
    soundEffects.playSparkleStar();
  }, []);

  const updateProfile = useCallback((updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) return [DEFAULT_CHILD_PROFILE];
      return filtered;
    });
  }, []);

  const selectTopicAndNavigate = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setScreen('topic-menu');
    soundEffects.playTopicChime();
    voiceAssistant.speak(topic.voiceName || topic.name);
  }, []);

  const startLesson = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson);
    setScreen('lesson-player');
    soundEffects.playPop();
    voiceAssistant.speak('Let us sing: ' + lesson.title);
  }, []);

  const finishLessonToActivity = useCallback(() => {
    setScreen('mini-activity');
    soundEffects.playSparkleStar();
    if (selectedLesson?.activity.audioPromptText) {
      setTimeout(() => {
        voiceAssistant.speak(selectedLesson.activity.audioPromptText || selectedLesson.activity.questionPrompt);
      }, 400);
    }
  }, [selectedLesson]);

  const finishActivityToReward = useCallback(() => {
    setScreen('reward');
    soundEffects.playRewardFanfare();
  }, []);

  const navigateHome = useCallback(() => {
    voiceAssistant.stop();
    soundEffects.playPop();
    setScreen('home');
  }, []);

  const completeCurrentLesson = useCallback(() => {
    if (!selectedLesson) return;
    const lessonId = selectedLesson.id;
    const topic = topics.find((t) => t.id === selectedLesson.topicId);

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfile.id) return p;

        const isAlreadyDone = p.completedLessons.includes(lessonId);
        const newCompleted = isAlreadyDone ? p.completedLessons : [...p.completedLessons, lessonId];
        const newStars = p.starsCount + 3;

        // Check badge unlocks
        const newBadges = [...p.badgesEarned];
        let unlockedBadge: Badge | null = null;

        // Topic badge check
        if (topic?.badgeId && !newBadges.includes(topic.badgeId)) {
          newBadges.push(topic.badgeId);
          unlockedBadge = BADGES.find((b) => b.id === topic.badgeId) || null;
        }

        // Super Star badge check (>= 3 lessons)
        if (newCompleted.length >= 3 && !newBadges.includes('badge_super')) {
          newBadges.push('badge_super');
          if (!unlockedBadge) {
            unlockedBadge = BADGES.find((b) => b.id === 'badge_super') || null;
          }
        }

        if (unlockedBadge) {
          setRecentBadgeUnlocked(unlockedBadge);
        }

        return {
          ...p,
          completedLessons: newCompleted,
          badgesEarned: newBadges,
          starsCount: newStars,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
      })
    );
  }, [selectedLesson, topics, activeProfile.id]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return activeProfile.completedLessons.includes(lessonId);
    },
    [activeProfile.completedLessons]
  );

  const getEarnedBadges = useCallback(() => {
    return BADGES.filter((b) => activeProfile.badgesEarned.includes(b.id));
  }, [activeProfile.badgesEarned]);

  const clearRecentBadge = useCallback(() => {
    setRecentBadgeUnlocked(null);
  }, []);

  // Parental Gate Controls
  const openParentGate = useCallback(() => {
    voiceAssistant.stop();
    soundEffects.playPop();
    setIsParentGateOpen(true);
  }, []);

  const closeParentGate = useCallback(() => {
    setIsParentGateOpen(false);
  }, []);

  const enterParentDashboard = useCallback(() => {
    setIsParentGateOpen(false);
    setScreen('parent-dashboard');
    soundEffects.playPop();
  }, []);

  const exitParentDashboard = useCallback(() => {
    soundEffects.playPop();
    setScreen('home');
  }, []);

  // Badge modal controls
  const openBadgeModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsBadgeModalOpen(true);
    voiceAssistant.speak('Look at all your shiny badges and stars!');
  }, []);

  const closeBadgeModal = useCallback(() => {
    soundEffects.playPop();
    setIsBadgeModalOpen(false);
  }, []);

  // Alphabet Soundboard modal
  const openAlphabetModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsAlphabetModalOpen(true);
    voiceAssistant.speak('Welcome to the A to Z Alphabet Explorer! Tap any letter!');
  }, []);

  const closeAlphabetModal = useCallback(() => {
    soundEffects.playPop();
    setIsAlphabetModalOpen(false);
  }, []);

  // Number Explorer modal
  const openNumberModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsNumberModalOpen(true);
    voiceAssistant.speak('Welcome to Numbers 1 to 100 and above! Tap any number!');
  }, []);

  const closeNumberModal = useCallback(() => {
    soundEffects.playPop();
    setIsNumberModalOpen(false);
  }, []);

  // Colors Explorer modal
  const openColorsModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsColorsModalOpen(true);
    voiceAssistant.speak('Welcome to Rainbow Colors! Tap any color!');
  }, []);

  const closeColorsModal = useCallback(() => {
    soundEffects.playPop();
    setIsColorsModalOpen(false);
  }, []);

  // Shapes Explorer modal
  const openShapesModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsShapesModalOpen(true);
    voiceAssistant.speak('Welcome to Shapes and Stars! Tap any shape!');
  }, []);

  const closeShapesModal = useCallback(() => {
    soundEffects.playPop();
    setIsShapesModalOpen(false);
  }, []);

  // Animals Explorer modal
  const openAnimalsModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsAnimalsModalOpen(true);
    voiceAssistant.speak('Welcome to Animal Safari and Farm Friends! Tap any animal!');
  }, []);

  const closeAnimalsModal = useCallback(() => {
    soundEffects.playPop();
    setIsAnimalsModalOpen(false);
  }, []);

  // Habits Explorer modal
  const openHabitsModal = useCallback(() => {
    soundEffects.playTopicChime();
    setIsHabitsModalOpen(true);
    voiceAssistant.speak('Welcome to Good Habits and Healthy Routines! Tap any habit!');
  }, []);

  const closeHabitsModal = useCallback(() => {
    soundEffects.playPop();
    setIsHabitsModalOpen(false);
  }, []);

  // Custom Lesson Management (Admin)
  const addCustomLesson = useCallback((newLessonData: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...newLessonData,
      id: 'lesson_custom_' + Date.now(),
    };
    setLessons((prev) => {
      const updated = [...prev, newLesson];
      const customOnly = updated.filter((l) => l.id.startsWith('lesson_custom_'));
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });
    soundEffects.playSparkleStar();
  }, []);

  const updateLesson = useCallback((updatedLesson: Lesson) => {
    setLessons((prev) => {
      const updated = prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l));
      const customOnly = updated.filter((l) => l.id.startsWith('lesson_custom_'));
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const deleteLesson = useCallback((lessonId: string) => {
    setLessons((prev) => {
      const updated = prev.filter((l) => l.id !== lessonId);
      const customOnly = updated.filter((l) => l.id.startsWith('lesson_custom_'));
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        selectedTopic,
        setSelectedTopic,
        selectedLesson,
        setSelectedLesson,
        navigateHome,
        selectTopicAndNavigate,
        startLesson,
        finishLessonToActivity,
        finishActivityToReward,

        profiles,
        activeProfile,
        setActiveProfileId,
        createProfile,
        updateProfile,
        deleteProfile,

        topics,
        lessons,
        badges: BADGES,
        addCustomLesson,
        updateLesson,
        deleteLesson,

        completeCurrentLesson,
        isLessonCompleted,
        getEarnedBadges,
        recentBadgeUnlocked,
        clearRecentBadge,

        isParentGateOpen,
        openParentGate,
        closeParentGate,
        enterParentDashboard,
        exitParentDashboard,

        isBadgeModalOpen,
        openBadgeModal,
        closeBadgeModal,

        isAlphabetModalOpen,
        openAlphabetModal,
        closeAlphabetModal,

        isNumberModalOpen,
        openNumberModal,
        closeNumberModal,

        isColorsModalOpen,
        openColorsModal,
        closeColorsModal,

        isShapesModalOpen,
        openShapesModal,
        closeShapesModal,

        isAnimalsModalOpen,
        openAnimalsModal,
        closeAnimalsModal,

        isHabitsModalOpen,
        openHabitsModal,
        closeHabitsModal,

        settings,
        updateSettings,
        toggleSound,
        toggleVoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
