# ✨ Little Sparks - Preschool Learning App (Ages 2–5)

<div align="center">
  <img src="public/sparky.png" alt="Sparky Mascot" width="160" />
  <h3>Playful, Melodic & Touch-First Preschool Learning</h3>
  <p>Interactive Toddler App built with <b>React Native (Expo SDK 57)</b> and <b>React + TypeScript + Vite</b>.</p>
</div>

---

## 🌟 Overview

**Little Sparks** is designed specifically for small toddler hands (ages 2 to 5). Featuring **Sparky**, a cheerful golden star mascot, the app offers a safe, ad-free, positive-only learning space with voice narration, catchy preschool songs, and interactive soundboards.

---

## 🎯 Key Features

- **⭐ Meet Sparky**: Tap Sparky on the home screen to see fun winks and cheerful reactions, watch Sparky dance along during songs, and celebrate with star confetti!
- **🔢 1 to 100+ Number Explorer**: 
  - Speaks full English words (e.g., *"sixty-seven"*, *"fifteen"*, *"ninety"*).
  - Tapped numbers pulse and highlight while spoken.
  - **Count Aloud Mode**: Reads numbers in sequence (1, 2, 3...) at a toddler-friendly speed.
- **🔤 Alphabet Phonics & Songs**: Complete A to Z cards with phonics recitation and upbeat preschool melodies.
- **🎨 Rainbow Colors & Shapes**: Rich visual touchboards for colors, geometric shapes, and stars.
- **🦁 Animals & Healthy Routines**: Engaging soundboards for safari animals, handwashing, brushing teeth, and healthy habits.
- **🎵 YouTube / Cocomelon-Style Songs**: Bouncing karaoke lyrics with synchronized visuals, play/pause/replay controls, and star rewards.
- **🔒 Parent Lock & Star Rewards**: Star collection system with positive-only reinforcement and protected settings.

---

## 🚀 Getting Started

### 1. Web Version
Run the app in your browser:
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build for production
npm run build
```

---

### 2. Mobile App (Expo SDK 57)
Run on your physical iOS/Android device via **Expo Go**:
```bash
# Start the Expo Metro bundler
npm start

# Or with network tunnel (if on a different Wi-Fi network)
npm run tunnel
```
Scan the QR code with your camera (iOS) or the Expo Go app (Android).

---

## ☁️ EAS Update & Cloud Hosting

You can load and test Little Sparks on your phone anytime via **Expo Go**, even when your computer is offline.

### One-Time EAS Setup:
```bash
# Log in to your Expo account
npx eas login

# Link the project
npx eas init

# Configure update channels
npx eas update:configure
```

### Publish Updates:
```bash
# Publish to preview branch
npm run publish:preview

# Publish to production branch
npm run publish:prod
```

---

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 57 / React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS / React Native StyleSheet
- **Audio & Speech**: `expo-speech`, `expo-av`, Web Speech API
- **Icons & Visuals**: Lucide Icons, Canvas Confetti
- **Cloud & Updates**: Expo Application Services (EAS Update)

---

## 📄 License
MIT License - Created with ❤️ for little learners.
