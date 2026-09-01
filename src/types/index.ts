export type AvatarId = 'lion' | 'bunny' | 'bear' | 'kitty' | 'puppy' | 'dino' | 'panda' | 'monkey';

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

export interface LyricLine {
  timeSec: number;
  text: string;
  highlightEmoji?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  type: 'song' | 'video';
  mediaUrl?: string; // Optional YouTube or MP4 link
  durationSeconds: number;
  thumbnailEmoji: string;
  accentColor: string;
  lyrics?: LyricLine[];
  interactiveTheme?: 'alphabet_dance' | 'counting_farm' | 'rainbow_paint' | 'shape_parade' | 'animal_safari' | 'healthy_routine' | 'custom';
  activity: Activity;
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

export interface ChildProfile {
  id: string;
  name: string;
  age: number; // 2, 3, 4, 5
  avatar: AvatarId;
  completedLessons: string[]; // array of lesson IDs
  badgesEarned: string[]; // array of badge IDs
  totalTimeSpentSeconds: number;
  starsCount: number;
  lastActiveDate: string;
}

export interface AppSettings {
  soundFxEnabled: boolean;
  voiceNarrationEnabled: boolean;
  speechRate: number; // 0.8 to 1.2
  speechPitch: number; // 1.0 to 1.4 for cheerful voice
  maxDailyMinutes: number; // e.g. 20, 30, 45 or 0 for unlimited
  volume: number; // 0.0 to 1.0
}

export type ScreenState = 
  | 'splash'
  | 'profile-select'
  | 'home'
  | 'topic-menu'
  | 'lesson-player'
  | 'mini-activity'
  | 'reward'
  | 'parent-dashboard';
