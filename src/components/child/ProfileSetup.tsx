import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVATAR_OPTIONS } from '../../data/initialContent';
import type { AvatarId } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { voiceAssistant } from '../../services/voiceAssistant';
import { Plus, Check, ArrowLeft, Sparkles, User } from 'lucide-react';

export const ProfileSetup: React.FC = () => {
  const { profiles, activeProfile, setActiveProfileId, createProfile, setScreen } = useApp();

  const [isCreatingNew, setIsCreatingNew] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [selectedAge, setSelectedAge] = useState(3);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('lion');

  const handleSelectProfile = (id: string, profileName: string) => {
    setActiveProfileId(id);
    soundEffects.playSparkleStar();
    voiceAssistant.speak(`Hello ${profileName}! Let's play!`);
    setScreen('home');
  };

  const handleAvatarClick = (avatar: (typeof AVATAR_OPTIONS)[0]) => {
    setSelectedAvatar(avatar.id);
    soundEffects.playPop();
    voiceAssistant.speak(avatar.name);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Explorer';
    createProfile(finalName, selectedAge, selectedAvatar);
    voiceAssistant.speak(`Welcome ${finalName}! You are ready to explore!`);
    setScreen('home');
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-b from-amber-100 via-rose-50 to-sky-100 flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-amber-100">
          <button
            onClick={() => setScreen('home')}
            className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 kid-btn-pop"
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-amber-950 flex items-center justify-center gap-2">
              <span>Who is Playing?</span>
              <span>🎨</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-semibold">
              Select or create a child profile
            </p>
          </div>

          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* Profiles List */}
        {!isCreatingNew && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {profiles.map((prof) => {
                const avatar = AVATAR_OPTIONS.find((a) => a.id === prof.avatar) || AVATAR_OPTIONS[0];
                const isActive = prof.id === activeProfile.id;

                return (
                  <button
                    key={prof.id}
                    onClick={() => handleSelectProfile(prof.id, prof.name)}
                    className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-center transition kid-card relative ${
                      isActive
                        ? 'bg-amber-100 border-amber-500 shadow-xl ring-4 ring-amber-200'
                        : 'bg-white border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-md mb-2 ${avatar.bgColor}`}>
                      {avatar.emoji}
                    </div>
                    <div className="font-black text-lg text-gray-800 leading-tight">
                      {prof.name}
                    </div>
                    <div className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1">
                      <span>Age {prof.age}</span>
                      <span>•</span>
                      <span>⭐ {prof.starsCount}</span>
                    </div>

                    {isActive && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Add New Profile Tile */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setIsCreatingNew(true);
                }}
                className="p-4 rounded-3xl border-4 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100 flex flex-col items-center justify-center text-amber-700 transition kid-card min-h-[160px]"
              >
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center mb-2">
                  <Plus className="w-8 h-8 text-amber-700 stroke-[3]" />
                </div>
                <div className="font-black text-base">Add Child</div>
              </button>
            </div>
          </div>
        )}

        {/* Create Profile Form */}
        {isCreatingNew && (
          <form onSubmit={handleCreateSubmit} className="space-y-5 animate-pop-in">
            {/* Step 1: Pick an Avatar */}
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2 text-center">
                1. Pick your animal buddy!
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarClick(avatar)}
                      className={`p-2 rounded-2xl border-3 flex flex-col items-center justify-center transition kid-btn-pop ${
                        isSelected
                          ? `${avatar.bgColor} border-gray-900 scale-105 shadow-lg ring-2 ring-amber-400`
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-3xl">{avatar.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Child Name */}
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1">
                2. Child's Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo, Mia, Noah..."
                  maxLength={20}
                  className="w-full px-4 py-3.5 rounded-2xl border-3 border-amber-300 focus:border-amber-500 focus:outline-none text-lg font-bold text-gray-800 bg-amber-50/50"
                  required
                />
                <User className="w-5 h-5 text-gray-400 absolute right-4 top-4" />
              </div>
            </div>

            {/* Step 3: Age Selector */}
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1">
                3. Age
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[2, 3, 4, 5].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => {
                      setSelectedAge(age);
                      soundEffects.playPop();
                      voiceAssistant.speak(`${age} years old!`);
                    }}
                    className={`py-3 rounded-2xl font-black text-lg border-3 transition kid-btn-pop ${
                      selectedAge === age
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md'
                        : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {age} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="flex gap-3 pt-3">
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-3 border-emerald-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 kid-btn-pop transition"
              >
                <Sparkles className="w-5 h-5" />
                <span>Save & Start!</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
