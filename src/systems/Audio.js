class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensureContext() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
  }

  resume() {
    this.ensureContext();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  play(name) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    switch (name) {
      case 'merge':
        this.chord([523.25, 659.25, 783.99], t, 0.28, 'triangle');
        break;
      case 'attack':
        this.blip(880, 0.06, t, 'square', 0.06);
        break;
      case 'monster_die':
        this.slide(340, 110, 0.18, t, 'sawtooth', 0.14);
        break;
      case 'castle_hit':
        this.blip(140, 0.18, t, 'sawtooth', 0.22);
        break;
      case 'wave_clear':
        this.chord([392, 523.25, 659.25], t, 0.3, 'sine');
        break;
      case 'game_over':
        this.slide(440, 60, 0.7, t, 'triangle', 0.2);
        break;
      default:
        break;
    }
  }

  blip(freq, dur, t0, type = 'sine', gain = 0.1) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  slide(fromHz, toHz, dur, t0, type = 'sine', gain = 0.12) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(fromHz, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, toHz), t0 + dur);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  chord(freqs, t0, dur, type = 'sine') {
    for (const f of freqs) this.blip(f, dur, t0, type, 0.08);
  }
}

export const gameAudio = new GameAudio();
