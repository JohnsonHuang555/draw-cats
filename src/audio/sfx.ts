import type { Rarity } from '../domain/rarity';

const MUTE_KEY = 'draw-card-game:muted';

/**
 * Placeholder sound effects, synthesised with Web Audio so the project needs no audio assets.
 * Swap individual methods for sampled sounds later without touching callers.
 */
export class Sfx {
  private ctx?: AudioContext;
  private master?: GainNode;
  private noiseBuffer?: AudioBuffer;
  muted: boolean;

  constructor() {
    this.muted = readMuted();
  }

  /** Must be called from a user gesture before any sound plays. */
  unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 1.5;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      // Storage unavailable: keep the setting for this session only.
    }
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.6, this.ctx.currentTime, 0.02);
  }

  /** Tiny "plip" for a Tap Fish; pitch varies so rapid taps don't drone. */
  plip() {
    this.tone(1200 + Math.random() * 500, 0.07, { type: 'sine', gain: 0.08 });
  }

  click() {
    this.tone(880, 0.06, { type: 'triangle', gain: 0.15 });
  }

  whoosh() {
    this.noise(0.6, { from: 300, to: 2400, q: 1.2, gain: 0.35 });
  }

  /** Hint shimmer when the Pack appears, brighter for higher Rarity. */
  packHint(rarity: Rarity) {
    const base = { N: 0, R: 1, SR: 2, SSR: 3 }[rarity];
    const notes = [523, 659, 784, 1047, 1319].slice(0, base + 2);
    notes.forEach((f, i) => this.tone(f, 0.5, { delay: i * 0.07, type: 'sine', gain: 0.12 }));
  }

  tear() {
    this.noise(0.45, { from: 4000, to: 600, q: 0.8, gain: 0.7 });
    this.noise(0.15, { from: 8000, to: 3000, q: 2, gain: 0.4, delay: 0.05 });
    this.tone(90, 0.5, { type: 'sine', gain: 0.5, slideTo: 45 });
  }

  /** Glass-crack sting + rising sweep when the Fake-out flips to SSR. */
  fakeOut() {
    this.noise(0.25, { from: 9000, to: 5000, q: 6, gain: 0.6 });
    this.tone(220, 0.9, { type: 'sawtooth', gain: 0.18, slideTo: 1760, delay: 0.05 });
    this.tone(55, 1.2, { type: 'sine', gain: 0.7, slideTo: 35, delay: 0.1 });
    [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 1.0, { delay: 0.35 + i * 0.06, gain: 0.12 }));
  }

  deal() {
    this.noise(0.12, { from: 2500, to: 1200, q: 1.5, gain: 0.2 });
  }

  /** Rising charge for a Card Hint. */
  charge(rarity: Rarity, duration: number) {
    const top = rarity === 'SSR' ? 1400 : 900;
    this.tone(180, duration, { type: 'sawtooth', gain: 0.08, slideTo: top });
    this.tone(360, duration, { type: 'sine', gain: 0.1, slideTo: top * 2 });
    this.noise(duration, { from: 400, to: 6000, q: 3, gain: 0.12 });
  }

  flip() {
    this.noise(0.09, { from: 3000, to: 1500, q: 2, gain: 0.35 });
  }

  reveal(rarity: Rarity) {
    const chords: Record<Rarity, number[]> = {
      N: [659],
      R: [587, 880],
      SR: [523, 659, 784, 1047],
      SSR: [392, 523, 659, 784, 1047, 1319, 1568],
    };
    const gain = { N: 0.12, R: 0.14, SR: 0.16, SSR: 0.16 }[rarity];
    chords[rarity].forEach((f, i) => this.tone(f, rarity === 'SSR' ? 2.2 : 0.9, { delay: i * 0.05, gain }));
    if (rarity === 'SSR' || rarity === 'SR') {
      this.tone(rarity === 'SSR' ? 50 : 70, 1.4, { type: 'sine', gain: 0.6, slideTo: 30 });
      this.noise(1.2, { from: 8000, to: 2000, q: 0.5, gain: 0.2 });
      this.meow(rarity === 'SSR' ? 1.15 : 1, 0.25);
      if (rarity === 'SSR') this.meow(1.4, 0.85);
    }
  }

  /** Synthesised meow: a pitch rise-and-fall through a moving vowel formant. */
  meow(pitch = 1, delay = 0) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const dur = 0.55;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(780 * pitch, t + 0.14);
    osc.frequency.exponentialRampToValueAtTime(520 * pitch, t + dur);
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 7;
    vibratoGain.gain.value = 12 * pitch;
    vibrato.connect(vibratoGain).connect(osc.frequency);

    // "m" → "ee" → "ow": the formant opens up then closes.
    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = 3;
    formant.frequency.setValueAtTime(700, t);
    formant.frequency.exponentialRampToValueAtTime(2200, t + 0.15);
    formant.frequency.exponentialRampToValueAtTime(900, t + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.06);
    g.gain.setValueAtTime(0.5, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(formant).connect(g).connect(this.master);
    osc.start(t);
    vibrato.start(t);
    osc.stop(t + dur + 0.05);
    vibrato.stop(t + dur + 0.05);
  }

  private tone(
    freq: number,
    duration: number,
    opts: { delay?: number; type?: OscillatorType; gain?: number; slideTo?: number } = {},
  ) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.gain ?? 0.2, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  private noise(duration: number, opts: { from: number; to: number; q: number; gain: number; delay?: number }) {
    if (!this.ctx || !this.master || !this.noiseBuffer) return;
    const t = this.ctx.currentTime + (opts.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = opts.q;
    filter.frequency.setValueAtTime(opts.from, t);
    filter.frequency.exponentialRampToValueAtTime(opts.to, t + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + duration + 0.05);
  }
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}
