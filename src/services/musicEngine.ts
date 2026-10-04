/**
 * Little Sparks Melodic Music & Sound Effects Engine
 * Generates sweet, melodic preschool backing music and joyful sound effects
 * using the Web Audio API with zero external asset dependencies (100% offline capable).
 */

class MusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentSongTimer: number | null = null;
  private volume: number = 0.35;
  private isBedtime: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setBedtimeMode(enabled: boolean) {
    this.isBedtime = enabled;
  }

  /**
   * Play a clean, warm bell/marimba tone at a specific frequency
   */
  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', gainMultiplier = 1.0) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const targetVol = this.volume * gainMultiplier * (this.isBedtime ? 0.4 : 0.8);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(targetVol, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Safe ignore
    }
  }

  /**
   * Play a joyful star chime when collecting a star or tapping Sparky
   */
  public playStarChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // C6, E6, G6, B6, C7 bright sparkling arpeggio
    const notes = [1046.5, 1318.5, 1567.98, 1975.53, 2093.0];
    notes.forEach((freq, index) => {
      this.playTone(freq, now + index * 0.08, 0.4, 'triangle', 0.6);
    });
  }

  /**
   * Play a cheerful bubbly pop sound for button taps
   */
  public playPop() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Safe ignore
    }
  }

  /**
   * Play a celebration victory fanfare when completing an activity/lesson
   */
  public playCelebrationFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // C5, G5, C6 triumphant chord
    const chords = [
      { freq: 523.25, time: 0, dur: 0.2 },
      { freq: 659.25, time: 0.15, dur: 0.2 },
      { freq: 783.99, time: 0.3, dur: 0.25 },
      { freq: 1046.5, time: 0.5, dur: 0.6 },
    ];

    chords.forEach((c) => {
      this.playTone(c.freq, now + c.time, c.dur, 'triangle', 0.8);
      this.playTone(c.freq * 0.5, now + c.time, c.dur, 'sine', 0.5);
    });
  }

  /**
   * Start cheerful rhythmic background chords synced to song tempo (BPM)
   */
  public startMelodyTrack(bpm: number = 96, theme: string = 'alphabet_dance') {
    this.stopMelodyTrack();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;
    const beatSec = 60 / bpm;

    // Harmonic progression notes (C major, F major, G major, A minor)
    let chordScale: number[][] = [
      [261.63, 329.63, 392.0], // C
      [349.23, 440.0, 523.25], // F
      [392.0, 493.88, 587.33], // G
      [261.63, 329.63, 392.0], // C
    ];

    if (theme === 'lullaby_stars' || this.isBedtime) {
      chordScale = [
        [261.63, 392.0], // Gentle C - G fifth
        [329.63, 392.0], // E - G
        [349.23, 440.0], // F - A
        [261.63, 329.63], // C - E
      ];
    }

    let beatCount = 0;
    const scheduleNextBeats = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;

      const chordIndex = Math.floor(beatCount / 4) % chordScale.length;
      const currentChord = chordScale[chordIndex];

      // Play soft bass root note on beat 1
      if (beatCount % 4 === 0) {
        this.playTone(currentChord[0] * 0.5, now, beatSec * 1.5, 'sine', 0.6);
      }

      // Play cheerful marimba harmony notes on each beat
      const harmonyNote = currentChord[beatCount % currentChord.length];
      this.playTone(harmonyNote, now, beatSec * 0.8, 'triangle', 0.35);

      beatCount++;
      this.currentSongTimer = window.setTimeout(scheduleNextBeats, beatSec * 1000);
    };

    scheduleNextBeats();
  }

  /**
   * Stop background melody track
   */
  public stopMelodyTrack() {
    this.isPlaying = false;
    if (this.currentSongTimer) {
      clearTimeout(this.currentSongTimer);
      this.currentSongTimer = null;
    }
  }
}

export const musicEngine = new MusicEngine();
