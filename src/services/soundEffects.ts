/**
 * Web Audio API Sound Effects & Melody Synth Engine for Toddlers / Preschoolers
 * Generates gentle, melodic, joyful sounds and rhythmic musical beats.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /** Soft cheerful pop for UI buttons */
  public playPop() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio safe ignore
    }
  }

  /** Joyful chime when tapping a topic tile */
  public playTopicChime() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, ctx.currentTime + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.2);
      });
    } catch {
      // Audio safe ignore
    }
  }

  /** Star sparkle chime for mini activity correct answer */
  public playSparkleStar() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch {
      // Audio safe ignore
    }
  }

  /** Grand Fanfare Celebration for Reward Screen / Badges */
  public playRewardFanfare() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const chord = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.16 },
        { f: 1046.50, t: 0.42, d: 0.5 },
        { f: 1318.51, t: 0.45, d: 0.5 },
      ];

      chord.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);

        gain.gain.setValueAtTime(0, ctx.currentTime + item.t);
        gain.gain.linearRampToValueAtTime(this.volume * 0.45, ctx.currentTime + item.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + item.t);
        osc.stop(ctx.currentTime + item.t + item.d);
      });
    } catch {
      // Audio safe ignore
    }
  }

  /** Gentle boing */
  public playGentleBoing() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio safe ignore
    }
  }

  /** Musical note generator for song visualizer demo melody with xylophone warmth */
  public playNote(frequency: number, duration: number = 0.2) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Safe ignore
    }
  }

  /** Play a lively nursery rhyme rhythm chord for song transitions */
  public playRhythmChord(chordType: 'C' | 'G' | 'F' | 'Am' = 'C') {
    if (!this.enabled) return;
    const chords = {
      C: [523.25, 659.25, 783.99],
      G: [392.00, 493.88, 587.33],
      F: [349.23, 440.00, 523.25],
      Am: [440.00, 523.25, 659.25],
    };
    const freqs = chords[chordType] || chords.C;
    freqs.forEach((f) => this.playNote(f, 0.22));
  }
}

export const soundEffects = new SoundEffectsEngine();
