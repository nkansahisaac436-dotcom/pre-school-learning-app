export type AvatarId = 'sparky' | 'lion' | 'bunny' | 'bear' | 'kitty' | 'puppy' | 'dino' | 'panda' | 'monkey';

export interface AvatarOption {
  id: AvatarId;
  name: string;
  emoji: string;
  bgColor: string;
}

export interface ActivityOption {
  id: string;
  label: string; // Used for screen reader / speech narration
  imageEmoji?: string;
  imageUrl?: string;
  color?: string;
  isCorrect: boolean;
}

export interface Activity {
  id: string;
  questionPrompt: string; // e.g. "Which one is the letter A?"
  audioPromptText?: string;
  options: ActivityOption[];
  feedbackSuccessText?: string;
  feedbackRetryText?: string;
}

export interface LyricWord {
  word: string;
  startSec: number;
  endSec: number;
}

export interface LyricLine {
  timeSec: number;
  endSec?: number;
  text: string;
  highlightEmoji?: string;
  words?: LyricWord[];
  tapTargetPrompt?: string;
  tapTargetEmoji?: string;
}

export type MiniGameType = 'matching' | 'find_color' | 'count_stars' | 'memory';

export interface MiniGameOption {
  id: string;
  label: string;
  emoji: string;
  color?: string;
  matchId?: string;
  isTarget?: boolean;
}

export interface MiniGameConfig {
  type: MiniGameType;
  title: string;
  prompt: string;
  options: MiniGameOption[];
  targetCount?: number;
  targetColor?: string;
  feedbackText: string;
}

export interface MelodyNote {
  note: string; // e.g. "C4", "E4", "G4", "A4"
  durationSec: number; // e.g. 0.5, 1.0
  timeSec: number;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  type: 'song' | 'video';
  mediaUrl?: string; // Optional YouTube or audio file link
  durationSeconds: number;
  thumbnailEmoji: string;
  accentColor: string;
  bpm?: number; // 80 to 110 BPM
  isBedtimeLullaby?: boolean;
  lyrics?: LyricLine[];
  melodyNotes?: MelodyNote[];
  interactiveTheme?: 'alphabet_dance' | 'counting_farm' | 'rainbow_paint' | 'shape_parade' | 'animal_safari' | 'healthy_routine' | 'lullaby_stars' | 'custom';
  activity: Activity;
  miniGame?: MiniGameConfig;
}

export interface Topic {
  id: string;
  name: string;
  voiceName?: string;
  iconEmoji: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
    shadow: string;
  };
  order: number;
  badgeId: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export interface StickerItem {
  id: string;
  title: string;
  emoji: string;
  category: 'letters' | 'numbers' | 'colors' | 'shapes' | 'animals' | 'sparky';
  rarity: 'common' | 'rare' | 'super_star';
  description: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number; // 2, 3, 4, 5
  avatar: AvatarId;
  completedLessons: string[]; // array of lesson IDs
  badgesEarned: string[]; // array of badge IDs
  stickersEarned: string[]; // array of sticker IDs
  favoriteLessonIds: string[];
  totalTimeSpentSeconds: number;
  starsCount: number;
  streakDays: number;
  lastStreakDate: string; // YYYY-MM-DD
  lastActiveDate: string;
}

export interface AppSettings {
  soundFxEnabled: boolean;
  voiceNarrationEnabled: boolean;
  speechRate: number; // 0.8 to 1.2
  speechPitch: number; // 1.0 to 1.4 for cheerful voice
  maxDailyMinutes: number; // e.g. 15, 20, 30, 45 or 0 for unlimited
  volume: number; // 0.0 to 1.0
  bedtimeModeEnabled: boolean;
  autoPlayNext: boolean;
}

export type ScreenState = 
  | 'splash'
  | 'profile-select'
  | 'home'
  | 'topic-menu'
  | 'lesson-player'
  | 'mini-activity'
  | 'mini-game'
  | 'sticker-book'
  | 'reward'
  | 'parent-dashboard';
