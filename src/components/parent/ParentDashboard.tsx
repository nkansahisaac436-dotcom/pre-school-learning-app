import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVATAR_OPTIONS, BADGES } from '../../data/initialContent';
import type { AvatarId } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Volume2, 
  ShieldAlert,
  Download
} from 'lucide-react';

type Tab = 'progress' | 'profiles' | 'content' | 'settings';

export const ParentDashboard: React.FC = () => {
  const {
    activeProfile,
    profiles,
    setActiveProfileId,
    createProfile,
    deleteProfile,
    topics,
    lessons,
    addCustomLesson,
    deleteLesson,
    settings,
    updateSettings,
    exitParentDashboard,
    updateProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('progress');

  // New Child Profile Modal State
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAge, setNewProfileAge] = useState(3);
  const [newProfileAvatar, setNewProfileAvatar] = useState<AvatarId>('lion');

  // New Lesson Form State
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTopicId, setNewLessonTopicId] = useState(topics[0]?.id || 'topic_alphabets');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonType, setNewLessonType] = useState<'song' | 'video'>('song');
  const [newLessonMediaUrl, setNewLessonMediaUrl] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(45);
  const [newLessonEmoji, setNewLessonEmoji] = useState('🌟');
  const [newLessonTheme, setNewLessonTheme] = useState<'alphabet_dance' | 'counting_farm' | 'rainbow_paint' | 'shape_parade' | 'animal_safari' | 'healthy_routine' | 'custom'>('alphabet_dance');
  
  // Activity setup
  const [questionPrompt, setQuestionPrompt] = useState('Which one is the right match?');
  const [opt1Label, setOpt1Label] = useState('Correct Choice');
  const [opt1Emoji, setOpt1Emoji] = useState('⭐');
  const [opt2Label, setOpt2Label] = useState('Other Choice');
  const [opt2Emoji, setOpt2Emoji] = useState('🍎');

  // Format time spent helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createProfile(newProfileName.trim(), newProfileAge, newProfileAvatar);
    setNewProfileName('');
    setShowAddProfile(false);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    addCustomLesson({
      topicId: newLessonTopicId,
      title: newLessonTitle.trim(),
      description: newLessonDesc.trim() || 'Exciting interactive learning lesson!',
      type: newLessonType,
      mediaUrl: newLessonMediaUrl.trim() || undefined,
      durationSeconds: Number(newLessonDuration) || 45,
      thumbnailEmoji: newLessonEmoji || '🌟',
      accentColor: '#0ea5e9',
      interactiveTheme: newLessonTheme,
      lyrics: [
        { timeSec: 0, text: newLessonTitle, highlightEmoji: newLessonEmoji },
        { timeSec: 10, text: 'Sing and dance along with us! 🎵', highlightEmoji: '🎶' },
      ],
      activity: {
        id: 'act_custom_' + Date.now(),
        questionPrompt: questionPrompt.trim(),
        audioPromptText: questionPrompt.trim(),
        options: [
          {
            id: 'opt_c_1',
            label: opt1Label.trim(),
            imageEmoji: opt1Emoji.trim(),
            color: 'bg-emerald-100 border-emerald-400',
            isCorrect: true,
          },
          {
            id: 'opt_c_2',
            label: opt2Label.trim(),
            imageEmoji: opt2Emoji.trim(),
            color: 'bg-amber-100 border-amber-400',
            isCorrect: false,
          },
        ],
        feedbackSuccessText: 'Great job! You found the right answer!',
      },
    });

    setNewLessonTitle('');
    setNewLessonDesc('');
    setNewLessonMediaUrl('');
    setShowAddLesson(false);
  };

  const handleResetProgress = () => {
    if (window.confirm(`Reset all progress and stars for ${activeProfile.name}?`)) {
      updateProfile({
        ...activeProfile,
        completedLessons: [],
        badgesEarned: [],
        starsCount: 0,
        totalTimeSpentSeconds: 0,
      });
      soundEffects.playPop();
    }
  };

  const handleExportData = () => {
    const data = {
      profiles,
      lessons,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikj_learning_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 p-4 md:p-8 select-none">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={exitParentDashboard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Kids Area</span>
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Parent & Teacher Dashboard 🎓
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Manage learning profiles, progress, and lesson curriculum
              </p>
            </div>
          </div>

          {/* Active Profile Switcher */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-500">Active:</span>
            <select
              value={activeProfile.id}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer text-sm"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Age {p.age})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {[
            { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
            { id: 'profiles', label: 'Child Profiles', icon: Users },
            { id: 'content', label: 'Content & Lessons (Admin)', icon: BookOpen },
            { id: 'settings', label: 'App & Safety Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playPop();
                  setActiveTab(tab.id as Tab);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition shadow-sm ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROGRESS & ANALYTICS */}
        {activeTab === 'progress' && (
          <div className="space-y-6 animate-pop-in">
            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-black">
                  ⭐
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{activeProfile.starsCount}</div>
                  <div className="text-xs font-bold text-slate-500">Stars Earned</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {activeProfile.completedLessons.length}/{lessons.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500">Lessons Completed</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatTime(activeProfile.totalTimeSpentSeconds)}
                  </div>
                  <div className="text-xs font-bold text-slate-500">Time Spent</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {activeProfile.badgesEarned.length}/{BADGES.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500">Badges Unlocked</div>
                </div>
              </div>
            </div>

            {/* Per-Topic Completion Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <span>Topic Completion Breakdown for {activeProfile.name}</span>
                <span>📊</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => {
                  const topicLessons = lessons.filter((l) => l.topicId === topic.id);
                  const completedTopicCount = topicLessons.filter((l) =>
                    activeProfile.completedLessons.includes(l.id)
                  ).length;
                  const percentage =
                    topicLessons.length > 0
                      ? Math.round((completedTopicCount / topicLessons.length) * 100)
                      : 0;

                  return (
                    <div
                      key={topic.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{topic.iconEmoji}</span>
                          <span className="font-bold text-slate-900 text-base">{topic.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-500">
                          {completedTopicCount}/{topicLessons.length} done ({percentage}%)
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHILD PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-pop-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Registered Child Profiles</h3>
              <button
                onClick={() => setShowAddProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Child Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((p) => {
                const avatar = AVATAR_OPTIONS.find((a) => a.id === p.avatar) || AVATAR_OPTIONS[0];
                const isActive = p.id === activeProfile.id;

                return (
                  <div
                    key={p.id}
                    className={`p-6 rounded-3xl bg-white border-2 transition shadow-sm flex items-center justify-between ${
                      isActive ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${avatar.bgColor}`}
                      >
                        {avatar.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-black text-slate-900">{p.name}</h4>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-500">
                          Age: {p.age} yrs • Stars: {p.starsCount} ⭐ • Lessons: {p.completedLessons.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => setActiveProfileId(p.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                          Select
                        </button>
                      )}
                      {profiles.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete profile for ${p.name}?`)) {
                              deleteProfile(p.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                          title="Delete profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Profile Modal */}
            {showAddProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 mb-4">Add Child Profile</h3>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Child Name</label>
                      <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="e.g. Maya"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                      <select
                        value={newProfileAge}
                        onChange={(e) => setNewProfileAge(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none"
                      >
                        <option value={2}>2 years old</option>
                        <option value={3}>3 years old</option>
                        <option value={4}>4 years old</option>
                        <option value={5}>5 years old</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Avatar</label>
                      <div className="grid grid-cols-4 gap-2">
                        {AVATAR_OPTIONS.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setNewProfileAvatar(a.id)}
                            className={`p-2 rounded-xl text-2xl border-2 transition ${
                              newProfileAvatar === a.id
                                ? `${a.bgColor} border-slate-900 scale-105`
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            {a.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddProfile(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTENT & LESSONS (ADMIN PANEL) */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Curriculum Content & Lessons</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Add custom songs, videos, or questions to reinforce classroom topics
                </p>
              </div>

              <button
                onClick={() => setShowAddLesson(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Lesson</span>
              </button>
            </div>

            {/* List of Lessons by Topic */}
            <div className="space-y-4">
              {topics.map((topic) => {
                const topicLessons = lessons.filter((l) => l.topicId === topic.id);

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <span className="text-2xl">{topic.iconEmoji}</span>
                      <h4 className="font-black text-slate-900 text-base">{topic.name}</h4>
                      <span className="text-xs text-slate-400 font-bold">
                        ({topicLessons.length} lessons)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {topicLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-3xl">{lesson.thumbnailEmoji}</span>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-sm truncate">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {lesson.durationSeconds}s • {lesson.type} • Question: {lesson.activity.questionPrompt}
                              </div>
                            </div>
                          </div>

                          {lesson.id.startsWith('lesson_custom_') && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete lesson "${lesson.title}"?`)) {
                                  deleteLesson(lesson.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl"
                              title="Delete custom lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Lesson Modal */}
            {showAddLesson && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-black text-slate-900 mb-3">Add New Song/Video Lesson</h3>

                  <form onSubmit={handleSaveLesson} className="space-y-3.5 text-xs font-bold text-slate-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1">Topic</label>
                        <select
                          value={newLessonTopicId}
                          onChange={(e) => setNewLessonTopicId(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                        >
                          {topics.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">Lesson Type</label>
                        <select
                          value={newLessonType}
                          onChange={(e) => setNewLessonType(e.target.value as 'song' | 'video')}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                        >
                          <option value="song">Animated Song</option>
                          <option value="video">External Video URL</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Lesson Title</label>
                      <input
                        type="text"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="e.g. The Butterfly Life Cycle Song"
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1">Thumbnail Emoji</label>
                        <input
                          type="text"
                          value={newLessonEmoji}
                          onChange={(e) => setNewLessonEmoji(e.target.value)}
                          placeholder="e.g. 🦋"
                          maxLength={3}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xl"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Duration (Seconds)</label>
                        <input
                          type="number"
                          value={newLessonDuration}
                          onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                          min={20}
                          max={300}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Visual Theme</label>
                      <select
                        value={newLessonTheme}
                        onChange={(e) => setNewLessonTheme(e.target.value as typeof newLessonTheme)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="alphabet_dance">Alphabet & Phonics</option>
                        <option value="counting_farm">Counting & Numbers</option>
                        <option value="rainbow_paint">Colors & Rainbows</option>
                        <option value="shape_parade">Shapes & Stars</option>
                        <option value="animal_safari">Animals & Sounds</option>
                        <option value="healthy_routine">Good Habits & Health</option>
                      </select>
                    </div>

                    {newLessonType === 'video' && (
                      <div>
                        <label className="block mb-1">Video URL (YouTube or MP4)</label>
                        <input
                          type="text"
                          value={newLessonMediaUrl}
                          onChange={(e) => setNewLessonMediaUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                    )}

                    {/* Mini Activity Section */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                      <div className="text-amber-900 font-black">Mini-Activity (Reinforcement Game)</div>

                      <div>
                        <label className="block mb-1 text-slate-600">Question Prompt (Child Voice-Over)</label>
                        <input
                          type="text"
                          value={questionPrompt}
                          onChange={(e) => setQuestionPrompt(e.target.value)}
                          required
                          className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block mb-1 text-emerald-700">Correct Option (Label + Emoji)</label>
                          <input
                            type="text"
                            value={opt1Label}
                            onChange={(e) => setOpt1Label(e.target.value)}
                            placeholder="Label"
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold mb-1"
                          />
                          <input
                            type="text"
                            value={opt1Emoji}
                            onChange={(e) => setOpt1Emoji(e.target.value)}
                            placeholder="Emoji (e.g. 🦋)"
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold text-base"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-600">Other Option (Label + Emoji)</label>
                          <input
                            type="text"
                            value={opt2Label}
                            onChange={(e) => setOpt2Label(e.target.value)}
                            placeholder="Label"
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold mb-1"
                          />
                          <input
                            type="text"
                            value={opt2Emoji}
                            onChange={(e) => setOpt2Emoji(e.target.value)}
                            placeholder="Emoji (e.g. 🪨)"
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLesson(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
                      >
                        Save Lesson
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: APP & SAFETY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-pop-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Audio & Voice Controls</span>
                <Volume2 className="w-5 h-5 text-amber-500" />
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Sound Effects (Web Audio Synth)</div>
                    <div className="text-xs text-slate-500">Chimes, fanfares, star pops</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundFxEnabled}
                    onChange={(e) => updateSettings({ soundFxEnabled: e.target.checked })}
                    className="w-6 h-6 rounded accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Voice Narrator (Web Speech)</div>
                    <div className="text-xs text-slate-500">Reads questions & cheers aloud</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.voiceNarrationEnabled}
                    onChange={(e) => updateSettings({ voiceNarrationEnabled: e.target.checked })}
                    className="w-6 h-6 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Speech Speed / Rate Slider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Speech Narrator Speed: {settings.speechRate}x
                </label>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={settings.speechRate}
                  onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Safety & Data Management */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Data & Safety</span>
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Progress Backup (.JSON)</span>
                </button>

                <button
                  onClick={handleResetProgress}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Progress for {activeProfile.name}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
