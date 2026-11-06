/**
 * Web Audio API procedural sound engine for Candy Blast.
 * Zero external audio assets required; operates instantly and reliably with rich cheerful tones.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicMuted: boolean = false;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a simple tone with envelope
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.2, pitchDecay: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchDecay) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.3), now + duration);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  playSwap() {
    if (this.isMuted) return;
    this.playTone(420, 'sine', 0.08, 0.15);
  }

  playInvalidSwap() {
    if (this.isMuted) return;
    this.playTone(220, 'triangle', 0.18, 0.12, true);
  }

  // Match sound with pitch scaled by cascade combo index (1, 2, 3...)
  playMatch(comboIndex: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const baseNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5]; // Pentatonic C
      const noteIdx = Math.min(comboIndex - 1, baseNotes.length - 1);
      const freq = baseNotes[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio unlock safeguard
    }
  }

  // Striped candy laser zap
  playLaser() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  // Wrapped candy explosive pop
  playExplosion() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Color bomb rainbow zap
  playColorBomb() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const pitches = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      pitches.forEach((p, idx) => {
        setTimeout(() => {
          this.playTone(p, 'sine', 0.14, 0.2);
        }, idx * 60);
      });
    } catch {}
  }

  // Sweet/Tasty exclamation fanfare
  playSweet() {
    if (this.isMuted) return;
    const chords = [659.25, 830.61, 987.77];
    chords.forEach((note) => {
      this.playTone(note, 'triangle', 0.35, 0.18);
    });
  }

  // Level Win Victory fanfare
  playVictory() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 120 }, // C5
      { f: 659.25, d: 120 }, // E5
      { f: 783.99, d: 120 }, // G5
      { f: 1046.5, d: 350 }, // C6
    ];
    let time = 0;
    notes.forEach((n) => {
      setTimeout(() => {
        this.playTone(n.f, 'triangle', n.d / 1000, 0.28);
      }, time);
      time += n.d;
    });
  }

  playGameOver() {
    if (this.isMuted) return;
    const notes = [440, 415, 392, 349];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sine', 0.2, 0.18, true);
      }, i * 150);
    });
  }

  playHammer() {
    if (this.isMuted) return;
    this.playTone(600, 'square', 0.15, 0.3, true);
  }

  // Background playful marimba chime loop
  startBgm() {
    if (this.musicInterval !== null) return;
    const melody = [
      523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33,
      523.25, 587.33, 659.25, 783.99, 880, 1046.5, 880, 783.99
    ];

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicMuted && !this.isMuted) {
        const freq = melody[this.musicStep % melody.length];
        this.playTone(freq, 'sine', 0.18, 0.04);
      }
      this.musicStep++;
    }, 450);
  }

  stopBgm() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleSound(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    return this.isMusicMuted;
  }
}

export const sound = new SoundService();
