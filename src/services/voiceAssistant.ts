/**
 * Voice Narrator & Upbeat Song Reciter for "Little Sparks"
 * Uses Web Speech API with snappy, cheerful, melodic preschool pacing.
 */
import { numberToWords } from '../constants/app';

class VoiceAssistant {
  private enabled: boolean = true;
  private speechRate: number = 1.05;
  private speechPitch: number = 1.25;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingNumber: boolean = false;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public setRate(rate: number) {
    this.speechRate = Math.max(0.8, Math.min(1.4, rate));
  }

  public setPitch(pitch: number) {
    this.speechPitch = Math.max(0.8, Math.min(1.6, pitch));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        this.currentUtterance = null;
        this.isSpeakingNumber = false;
      } catch {
        // Safe ignore
      }
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingNumber || this.currentUtterance !== null;
  }

  /** Clean text of emojis and special characters for clear, snappy speech */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}]/gu, '')
      .replace(/[🎵🎶✨⭐🌟❤️🎉🎈🐮🦆🐑🚜🧼🫧🚿🪥😁🍎⚽🐱🍓🫐🍃🔴🔵🟡🟢⭕⏹️📐🅱️🅰️🅲🅳1️⃣2️⃣3️⃣4️⃣5️⃣]/g, '')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = this.speechRate;
      utterance.pitch = this.speechPitch;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      // Find the best friendly English voice if available
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Google US English') ||
            v.name.includes('Jenny') ||
            v.name.includes('Female'))
      );

      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        this.isSpeakingNumber = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        this.isSpeakingNumber = false;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeakingNumber = false;
      if (onEnd) onEnd();
    }
  }

  /**
   * Speaks numbers as FULL English words (e.g. 67 -> "sixty-seven"),
   * canceling any running audio and ensuring zero cut-offs.
   */
  public speakNumber(num: number | string, onEnd?: () => void) {
    const numInt = typeof num === 'string' ? parseInt(num, 10) : num;
    const spokenWord = isNaN(numInt) ? num.toString() : numberToWords(numInt);
    
    this.stop();
    this.isSpeakingNumber = true;

    // Small timeout to allow audio engine cleanup on rapid taps
    setTimeout(() => {
      this.speak(spokenWord, onEnd);
    }, 40);
  }

  /** Explicitly recite a song lyric line */
  public reciteLyric(lyricText: string) {
    this.speak(lyricText);
  }

  /** Speak a letter and word phonics clearly */
  public speakLetter(letter: string, word?: string) {
    const text = word ? `${letter}! ${letter} for ${word}!` : `Letter ${letter}!`;
    this.speak(text);
  }

  /** Cheerful praise phrases for children */
  public speakCheer(customMessage?: string, onEnd?: () => void) {
    const cheers = [
      'Hooray! Great job!',
      'Yay! You did it!',
      'Awesome! Super star!',
      'Sparky is so proud of you!',
      'High five, Little Spark!'
    ];
    const text = customMessage || cheers[Math.floor(Math.random() * cheers.length)];
    this.speak(text, onEnd);
  }

  /** Gentle encouragement if trying another answer */
  public speakEncouragement(onEnd?: () => void) {
    const encouragements = [
      'Good try! Tap another one!',
      'Almost! Try again!',
      'Sparky believes in you! Give it another tap!'
    ];
    const text = encouragements[Math.floor(Math.random() * encouragements.length)];
    this.speak(text, onEnd);
  }
}

export const voiceAssistant = new VoiceAssistant();
