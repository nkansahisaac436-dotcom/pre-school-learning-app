import * as Speech from 'expo-speech';
import { numberToWords } from '../../constants/app';

class NativeSpeechService {
  private enabled: boolean = true;
  private speechRate: number = 1.0;
  private speechPitch: number = 1.25;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public stop() {
    try {
      Speech.stop();
    } catch {
      // ignore
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}]/gu, '')
      .replace(/[🎵🎶✨⭐🌟❤️🎉🎈🐮🦆🐑🚜🧼🫧🚿🪥😁🍎⚽🐱🍓🫐🍃🔴🔵🟡🟢⭕⏹️📐🅱️🅰️🅲🅳1️⃣2️⃣3️⃣4️⃣5️⃣]/g, '')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(text: string, onDone?: () => void) {
    if (!this.enabled) {
      if (onDone) onDone();
      return;
    }

    const cleaned = this.cleanText(text);
    if (!cleaned) {
      if (onDone) onDone();
      return;
    }

    try {
      Speech.stop();
      Speech.speak(cleaned, {
        language: 'en-US',
        pitch: this.speechPitch,
        rate: this.speechRate,
        onDone: onDone,
        onError: onDone,
      });
    } catch {
      if (onDone) onDone();
    }
  }

  /**
   * Speaks numbers as FULL English words (e.g. 67 -> "sixty-seven"),
   * canceling running speech and ensuring zero cut-offs.
   */
  public speakNumber(num: number | string, onDone?: () => void) {
    const numInt = typeof num === 'string' ? parseInt(num, 10) : num;
    const spokenWord = isNaN(numInt) ? num.toString() : numberToWords(numInt);
    this.stop();
    setTimeout(() => {
      this.speak(spokenWord, onDone);
    }, 40);
  }

  public reciteLyric(lyric: string) {
    this.speak(lyric);
  }

  public speakLetter(letter: string, word?: string) {
    const text = word ? `${letter}! ${letter} for ${word}!` : `Letter ${letter}!`;
    this.speak(text);
  }

  public speakCheer(customCheer?: string, onDone?: () => void) {
    const cheers = [
      'Hooray! Great job!',
      'Yay! You did it!',
      'Awesome! Super star!',
      'Sparky is cheering for you!',
      'High five, Little Spark!'
    ];
    const text = customCheer || cheers[Math.floor(Math.random() * cheers.length)];
    this.speak(text, onDone);
  }

  public speakEncouragement(onDone?: () => void) {
    const encouragements = [
      'Good try! Tap another one!',
      'Almost! Try again!',
      'Sparky believes in you! Give it another tap!'
    ];
    const text = encouragements[Math.floor(Math.random() * encouragements.length)];
    this.speak(text, onDone);
  }
}

export const nativeSpeech = new NativeSpeechService();
