/* ========================================================================= */
/* ESPRESSO EXPRESS WEB AUDIO SYNTHESIZER                                    */
/* ========================================================================= */

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMuted = false;
    this.bgmOscillator = null;
    this.bgmInterval = null;

    this.settings = {
      masterVolume: 80,
      musicVolume: 60,
      sfxVolume: 85,
      hapticFeedback: true,
      screenShake: true,
      rushFlashes: true
    };
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.updateVolumes();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("AudioContext not supported or blocked", e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  updateVolumes(settings = {}) {
    this.settings = { ...this.settings, ...settings };
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;

    const master = (this.settings.masterVolume / 100);
    const sfx = (this.settings.sfxVolume / 100);
    const music = (this.settings.musicVolume / 100);

    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(master, now);
    this.sfxGain.gain.setValueAtTime(sfx, now);
    this.musicGain.gain.setValueAtTime(music * 0.4, now);
  }

  triggerHaptic(pattern = 15) {
    if (!this.settings.hapticFeedback) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (_) {}
    }
  }

  /* Sound Effects */
  playGrind() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(20);

    const now = this.ctx.currentTime;
    // Brown/white noise filtered for burr grinder
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.25);
  }

  playEspressoPull() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic([15, 30, 15]);

    const now = this.ctx.currentTime;
    // Steam hiss + water pump rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);

    // High hiss
    this.playHiss(0.3, 2200);
  }

  playHiss(duration = 0.25, freq = 2000) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(freq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  playMilkFroth() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(25);
    this.playHiss(0.35, 1600);
  }

  playSyrupPump() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(10);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playIceDrop() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(15);
    const now = this.ctx.currentTime;
    // 2 crisp high tinkles
    [0, 0.05].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 0 ? 1200 : 1650, now + delay);

      gain.gain.setValueAtTime(0.18, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.09);
    });
  }

  playCupPickup() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(10);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playServeSuccess(perfect = true) {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic([30, 40, 50]);
    const now = this.ctx.currentTime;

    // Service bell ding + pleasant harmonic chord
    const freqs = perfect ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.16, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.65);
    });
  }

  playOrderWrong() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic([50, 50, 50]);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(130, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playCleanSponge() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic(15);
    this.playHiss(0.18, 1200);
  }

  playCoinClink() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  playRushAlert() {
    this.ensureContext();
    if (!this.ctx) return;
    this.triggerHaptic([80, 50, 80]);
    const now = this.ctx.currentTime;

    [0, 0.18, 0.36].forEach((timeOffset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now + timeOffset);
      osc.frequency.linearRampToValueAtTime(440, now + timeOffset + 0.14);

      gain.gain.setValueAtTime(0.12, now + timeOffset);
      gain.gain.linearRampToValueAtTime(0.01, now + timeOffset + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.15);
    });
  }

  playTrainHorn() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Two-tone chord horn
    [261.63, 329.63].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }
}

export const audioSystem = new AudioSystem();
